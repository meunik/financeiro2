const { ipcMain } = require('electron');
const Db = require('@/Utils/db');
let db = new Db('nedb');

ipcMain.on('cadastrar', (event, params) => db.cadastrar({event, ...params}));
ipcMain.on('buscar', (event, params) => db.buscar({event, ...params}));
ipcMain.on('editar', (event, params) => db.edicao({event, ...params}));
ipcMain.on('remover', (event, params) => db.remover({event, ...params}));
ipcMain.on('zerar', () => db.zerar());
