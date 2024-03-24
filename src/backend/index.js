const { ipcMain, dialog } = require('electron');
const XLSX = require('xlsx');

import './base'
import './db'
import './arquivos'
import './bancos/nubank'

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

ipcMain.on('drawerOff', (event) => event.reply('drawerOff'));
