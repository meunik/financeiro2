const { ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
const XLSX = require('xlsx');
import { listarArquivos } from '@/Utils/Mapear';
import { cadastrar, buscar, edicao, remover, zerar } from '@/Utils/db';

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
      }
      resolve(JSON.parse(data));
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
    let fatura = await faturaMultLoop(pasta.path);
    let cadastraDb = {...pasta, ...fatura};
    try {
      let dados = await buscar({ path:pasta.path });
      if (!dados.length) cadastrar(cadastraDb);
    } catch (error) {
      console.error(error);
    }
  }
  
  event.reply('loadingOff');
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

ipcMain.on('mapear', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!!result.canceled) true;
    let diretorio = result.filePaths[0];
    let mapa = listarArquivos(diretorio);
    event.reply('mapeado', mapa);
  }).catch(err => {
    console.log(err);
  });
});



ipcMain.on('cadastrar', (event, {set}) => cadastrar(set, event, eventTxt));
ipcMain.on('buscar', (event, {get, eventTxt}) => buscar(get, event, eventTxt));
ipcMain.on('editar', (event, {get, editar, multi = false, eventTxt}) => {
  edicao(get, editar, multi, event, eventTxt)
});
ipcMain.on('remover', (event, {get, multi = false, eventTxt}) => remover(get, multi, event, eventTxt));
ipcMain.on('zerar', () => zerar());
