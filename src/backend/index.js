const { ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
import { listarArquivos } from '@/Utils/Mapear'

ipcMain.on('converterPdfParaJson', (event, pdfPath) => {
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
