const { ipcMain, dialog } = require('electron');
import { listarArquivos } from '@/Utils/Mapear';

const Db = require('@/Utils/db');
let db = new Db('arquvios');
let dbDiretorio = new Db('diretorio');

ipcMain.on('mapear', async (event) => {
  try {
    let result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!!result.canceled) return;
    event.reply('loadingOn');
    let diretorio = result.filePaths[0];
    if (diretorio) {
      await dbDiretorio.zerar('diretorio');
      dbDiretorio.cadastrar({set: {diretorio:diretorio}, event, eventTxt: 'buscaDiretorio'});
    }
    
    let mapa = listarArquivos(diretorio);
    if (mapa) {
      await db.zerar('arquvios');
      db.cadastrar({set: mapa});
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
      await db.zerar('arquvios');
      db.cadastrar({set: mapa});
    }
    event.reply('mapeado', mapa);
  } catch (error) {
    console.error(error);
  }
  
  event.reply('loadingOff');
});

ipcMain.on('buscarArquivos', (event) => {
  db.buscar({event, eventTxt: 'listarArquivos'});
});

ipcMain.on('buscarArquivosDiretorio', (event) => {
  dbDiretorio.buscar({event, eventTxt: 'buscaDiretorio'});
});
