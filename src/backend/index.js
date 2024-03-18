const { ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
const XLSX = require('xlsx');
import { listarArquivos } from '@/Utils/Mapear';
// import { cadastrar, buscar, edicao, remover, zerar } from '@/Utils/db';

const Db = require('@/Utils/db');
let db = new Db('nedb');
let python;

ipcMain.on('testePython', (event, cpf, senha) => {
  python = spawn('python', ['H:\\Projetos\\Electron\\financeiro2\\src\\python\\Teste.py', cpf, senha]);
  // let exePath;
  // if (process.env.NODE_ENV !== 'production') exePath = path.join(__static, 'cli.exe');
  // else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'cli.exe');
  // python = spawn(exePath, [cpf, senha]);

  let abredialogCodigo = true;
  python.stdout.on('data', (data) => {
    if (abredialogCodigo && (data.length > 2)) {
      console.log(`stdout:`);
      console.log(data.toString());
      console.log('---');
      console.log(data);
      event.reply('dialogCodigo', data.toString(), abredialogCodigo);
      abredialogCodigo = false;
    } else {
      console.log(data);
      event.reply('dialogCodigo', null, false);
      event.reply('notificacao', 'Falha ao gerar certificado.', 'error', 2000);
    }
  });

  python.stderr.on('data', (data) => {
    event.reply('notificacao', 'Falha ao gerar certificado.', 'error', 2000);
  });
  
  python.on('close', (code) => {
    //
  });
});
ipcMain.on('testePythonCodigo', (event, codigo) => {
  python.stdin.write(`${codigo}\n`);

  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    event.reply('notificacao', 'Certificado gerado com sucesso!', 'success', 2000);
  });
  
  python.on('close', (code) => {
    event.reply('loadingOff');
  });
});

ipcMain.on('fatura', (event, pdfPath) => {
  let exePath;
  if (process.env.NODE_ENV !== 'production') exePath = path.join(__static, 'FaturaNu.exe');
  else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'FaturaNu.exe');
  
  const python = spawn(exePath, [pdfPath]);
  
  let data = '';
  python.stdout.on('data', (chunk) => { 
    let decodedChunk = iconv.decode(chunk, 'latin1');
    data += decodedChunk;
  });

  python.on('close', (code) => {
    if (code !== 0) console.error(`Python script retornou ${code}`);
    event.reply('pdfJson', data);
  });
});

function faturaMultLoop(pastas) {
  return new Promise((resolve, reject) => {
    let exePath;
    if (process.env.NODE_ENV !== 'production') exePath = path.join(__static, 'FaturaNu.exe');
    else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'FaturaNu.exe');
    
    const python = spawn(exePath, [pastas]);
    
    let data = '';
    python.stdout.on('data', (chunk) => { 
      let decodedChunk = iconv.decode(chunk, 'latin1');
      data += decodedChunk;
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script retornou ${code}`);
        reject(`Python script retornou ${code}`);
      } else resolve(JSON.parse(data));
    });
  });
}

ipcMain.on('faturaMult', async (event, pastas) => {
  let faturas = [];
  for (let pasta of pastas) {
    let fatura = await faturaMultLoop(pasta.path);
    faturas.push({...pasta, ...fatura});
  }

  let agrupados = faturas.reduce((acc, obj) => {
    acc.total += obj.total;
    acc.pagamentos += obj.pagamentos;
    acc.estornos += obj.estornos;
    acc.entradas += obj.entradas;
    acc.saidas += obj.saidas;
    acc.transacoes = acc.transacoes.concat(obj.transacoes);
    return acc;
  }, {
    total: 0,
    pagamentos: 0,
    estornos: 0,
    entradas: 0,
    saidas: 0,
    transacoes: []
  });
  
  event.reply('faturaMultRetorno', faturas, agrupados);
});

ipcMain.on('addBaseDados', async (event, pastas) => {
  let faturas = [];
  for (let pasta of pastas) {
    try {
      let fatura = await faturaMultLoop(pasta.path);
      let diretorio = pasta.path.split('\\');
      let dir = diretorio[diretorio.length - 2];
      let cadastraDb = {...pasta, ...fatura, referencia:dir};
      let dados = await db.buscar({ path:pasta.path });
      if (!dados.length) db.cadastrar(cadastraDb);
      else db.edicao({ path:pasta.path }, cadastraDb, true)
    } catch (error) {
      console.error(error);
    }
  }
  
  event.reply('loadingOff');
  event.reply('attPagina');
});

ipcMain.on('exportarXlsx', async (event, dados) => {
  let bn = XLSX.utils.book_new();
  let jts = XLSX.utils.json_to_sheet(dados);
  XLSX.utils.book_append_sheet(bn, jts, "Sheet1");

  let write = XLSX.write(bn, {bookType:'xlsx', type:'buffer'});

  let { filePath } = await dialog.showSaveDialog({
    filters: [ { name: 'Excel', extensions: ['xlsx'] } ]
  });

  if (filePath) {
    let arquivo = filePath.split('\\').pop();
    require('fs').writeFileSync(filePath, write);
    event.reply('arquivoSalvo', `Download de ${arquivo} com sucesso!`);
  }
});

ipcMain.on('minimizar', (event) => {
  let win = BrowserWindow.getFocusedWindow()
  if(win) win.minimize()
});

ipcMain.on('fechar', () => {
  let win = BrowserWindow.getFocusedWindow();
  if (win) win.destroy();
});

ipcMain.on('maximizar', () => {
  let win = BrowserWindow.getFocusedWindow()
  if(win) {
    if(win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
});

ipcMain.on('mapear', async (event) => {
  try {
    let result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!!result.canceled) return;
    event.reply('loadingOn');
    let diretorio = result.filePaths[0];
    if (diretorio) {
      let db = new Db('diretorio');
      await db.zerar('diretorio');
      db.cadastrar({diretorio:diretorio}, event, 'salvarDiretorio');
    }
    
    let mapa = listarArquivos(diretorio);
    if (mapa) {
      let db = new Db('arquvios');
      await db.zerar('arquvios');
      db.cadastrar(mapa);
    }
    event.reply('mapeado', mapa);
  } catch (error) {
    console.error(error);
  }
  
  event.reply('loadingOff');
});

ipcMain.on('atualizarArquivos', async (event, diretorio) => {
  try {
    let mapa = listarArquivos(diretorio);
    if (mapa) {
      let db = new Db('arquvios');
      await db.zerar('arquvios');
      db.cadastrar(mapa);
    }
    event.reply('mapeado', mapa);
  } catch (error) {
    console.error(error);
  }
  
  event.reply('loadingOff');
});

ipcMain.on('buscarArquivos', (event) => {
  let db = new Db('arquvios');
  db.buscar({}, event, 'salvarArquivos');
});

ipcMain.on('buscarArquivosDiretorio', (event) => {
  let db = new Db('diretorio');
  db.buscar({}, event, 'salvarDiretorio');
});



ipcMain.on('cadastrar', (event, {set}) => db.cadastrar(set, event, eventTxt));
ipcMain.on('buscar', (event, {get, eventTxt}) => db.buscar(get, event, eventTxt));
ipcMain.on('editar', (event, {get, editar, multi = false, eventTxt}) => {
  db.edicao(get, editar, multi, event, eventTxt)
});
ipcMain.on('remover', (event, {get, multi = false, eventTxt}) => db.remover(get, multi, event, eventTxt));
ipcMain.on('zerar', () => db.zerar());
