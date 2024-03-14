const { ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
import { listarArquivos } from '@/Utils/Mapear'
const XLSX = require('xlsx')

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
    faturas.push(fatura);
  }
  event.reply('faturaMultRetorno', faturas);
  // console.log(faturas);
  // console.log(JSON.stringify(faturas, null, 2));
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
  let win = BrowserWindow.getFocusedWindow()
  if(win) win.close()
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
    if (!result.canceled) {
      let diretorio = result.filePaths[0];
      let mapa = listarArquivos(diretorio)
      event.reply('mapeado', mapa);
    }
  }).catch(err => {
    console.log(err);
  });
});
