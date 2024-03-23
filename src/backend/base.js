const { ipcMain, BrowserWindow } = require('electron');

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
