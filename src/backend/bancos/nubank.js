const { ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');

const Db = require('@/Utils/db');
let db = new Db('nubank/fatura');
let dbImport = new Db('nubank/faturaImportada');
let dbAuth = new Db('nubank/credenciais');
let python;

// AJUSTAR PARA DEPLOY
ipcMain.on('salvarFaturasCartao', async (event) => {
  try {
    const auth = await dbAuth.buscar({get: { tipo: 'nubank' }});
    let cpf = auth[0].cpf;
    let senha = auth[0].senha;
    let caminho = 'database/json/nubank/FaturasCartao';
    let cert = (process.env.NODE_ENV !== 'production')?'./public/cert.p12':'./resources/app.asar.unpacked/cert.p12';

    // let py = 'H:/Projetos/Electron/financeiro2/src/python/FaturasCartao.py';
    // python = spawn('python', [py, cert, cpf, senha, caminho]);

    let exePath;
    if (process.env.NODE_ENV !== 'production') exePath = path.resolve(__static,'..','scripts','FaturasCartao.exe');
    else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'FaturasCartao.exe');
    python = spawn(exePath, [cert, cpf, senha, caminho]);

    python.stdout.on('data', (data) => {
      console.log(data.toString());
      // let teste = data.toString();
      // console.log(teste);
      // console.log(JSON.parse(teste));
    });

    python.stderr.on('data', (data) => console.log(data.toString()));

    python.on('close', async (code) => {
      event.reply('loadingOff');
      // await dbAuth.zerar('nubank/credenciais');
      // dbAuth.cadastrar({ set: { cpf: cpf, senha: senha, tipo: 'nubank' } });
    });
  } catch (error) {
    console.log(error);
    event.reply('loadingOff');
  }
});

// AJUSTAR PARA DEPLOY
ipcMain.on('salvarTransacoes', async (event) => {
  try {
    const auth = await dbAuth.buscar({get: { tipo: 'nubank' }});
    let cpf = auth[0].cpf;
    let senha = auth[0].senha;
    let caminho = 'database/json/nubank/Transacao';
    let cert = (process.env.NODE_ENV !== 'production')?'./public/cert.p12':'./resources/app.asar.unpacked/cert.p12';

    let py = 'H:/Projetos/Electron/financeiro2/src/python/TransacoesPaginadas.py';
    python = spawn('python', [py, cert, cpf, senha, caminho]);

    // let exePath;
    // if (process.env.NODE_ENV !== 'production') exePath = path.resolve(__static, '..', 'scripts', 'TransacoesPaginadas.exe');
    // else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'TransacoesPaginadas.exe');
    // python = spawn(exePath, [cert, cpf, senha, caminho]);

    python.stdout.on('data', (data) => {
      let teste = data.toString();
      console.log(teste);
      console.log(JSON.parse(teste));
    });

    python.stderr.on('data', (data) => console.log(data.toString()));

    python.on('close', async (code) => {
      // await dbAuth.zerar('nubank/credenciais');
      // dbAuth.cadastrar({ set: { cpf: cpf, senha: senha, tipo: 'nubank' } });
    });
  } catch (error) {
    
  }
});

// AJUSTAR PARA DEPLOY
ipcMain.on('salvarGastosCartao', async (event) => {
  try {
    const auth = await dbAuth.buscar({get: { tipo: 'nubank' }});
    let cpf = auth[0].cpf;
    let senha = auth[0].senha;
    let caminho = 'database/json/nubank/GastosCartao.json';
    let cert = (process.env.NODE_ENV !== 'production')?'./public/cert.p12':'./resources/app.asar.unpacked/cert.p12';
    console.log(cert, cpf, senha, caminho);
  
    // let py = 'H:/Projetos/Electron/financeiro2/src/python/GastosCartao.py';
    // python = spawn('python', [py, cert, cpf, senha, caminho, true]);
  
    // params = (process.env.NODE_ENV !== 'production') ? [cert,cpf,senha,caminho,true] : [cert,cpf,senha,caminho];
  
    let exePath;
    if (process.env.NODE_ENV !== 'production') exePath = path.resolve(__static,'..','scripts','GastosCartao.exe');
    else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'GastosCartao.exe');
    params = [cert, cpf, senha, caminho];
    python = spawn(exePath, params);
    
    python.on('close', async (code) => {
      event.reply('notificacao', 'Gastos atualizads com sucesso!', 'success', 2000);
      event.reply('loadingOff');
    });
  } catch (error) {
    
  }
});

// AJUSTAR PARA DEPLOY
ipcMain.on('certificadoNubank', (event, {cpf, senha}) => {
  cpf = cpf.toString();
  senha = senha.toString();
  let caminho = (process.env.NODE_ENV !== 'production') ? './public/' : 'resources/app.asar.unpacked/';

  let py = 'H:/Projetos/Electron/financeiro2/src/python/Teste.py';
  python = spawn('python', [py, cpf, senha, caminho]);

  // let exePath;
  // if (process.env.NODE_ENV !== 'production') exePath = path.resolve(__static,'..','scripts','cli.exe');
  // else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'cli.exe');
  // python = spawn(exePath, [cpf, senha, caminho]);

  let abredialogCodigo = true;
  python.stdout.on('data', (data) => {
    if (abredialogCodigo && (data.length > 2)) {
      event.reply('dialogCodigo', data.toString(), abredialogCodigo);
      abredialogCodigo = false;
    }
  });

  python.stderr.on('data', (data) => console.log(data.toString()));

  python.on('close', async (code) => {
    await dbAuth.zerar('nubank/credenciais');
    dbAuth.cadastrar({ set: { cpf: cpf, senha: senha, tipo: 'nubank' } });
  });
});


ipcMain.on('certificadoNubankCodigo', (event, codigo) => {
  python.stdin.write(`${codigo.toString()}\n`);

  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data.toString()}`);
    event.reply('notificacao', 'Certificado gerado com sucesso!', 'success', 2000);
  });
  
  python.on('close', (code) => {
    event.reply('loadingOff');
  });
});

ipcMain.on('fatura', (event, pdfPath) => {
  let exePath;
  if (process.env.NODE_ENV !== 'production') exePath = path.resolve(__static,'..','scripts','FaturaNu.exe');
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
    if (process.env.NODE_ENV !== 'production') exePath = path.resolve(__static,'..','scripts','FaturaNu.exe');
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
      let dados = await dbImport.buscar({ path:pasta.path });
      if (!dados.length) dbImport.cadastrar({set: cadastraDb});
      else dbImport.edicao({get: { path:pasta.path }, set: cadastraDb, multi: true})
    } catch (error) {
      console.error(error);
    }
  }
  
  event.reply('loadingOff');
  event.reply('attPagina');
});

ipcMain.on('buscarFaturaImportada', (event, params) => dbImport.buscar({event, ...params}));
ipcMain.on('buscarFatura', (event, params) => db.buscar({event, ...params}));
