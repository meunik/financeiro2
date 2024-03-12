const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

ipcMain.on('converterPdfParaJson', (event, pdfPath) => {
  let exePath;
  if (process.env.NODE_ENV !== 'production') exePath = path.join(__static, 'FaturaNu.exe');
  else exePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'FaturaNu.exe');
  
  execFile(exePath, [pdfPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`Python script retornou com erro: ${error}`);
      return;
    }
    event.reply('pdfJson', stdout);
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
