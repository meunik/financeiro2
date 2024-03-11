const { ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

ipcMain.on('converterPdfParaJson', (event, pdfPath) => {
  // const python = spawn('resources\\FaturaNu.exe', [pdfPath]);
  const python = spawn(path.join(__static, 'FaturaNu.exe'), [pdfPath]);
  
  let data = '';
  python.stdout.on('data', (chunk) => { data += chunk.toString() });

  python.on('close', (code) => {
    if (code !== 0) console.error(`Python script retornou ${code}`);
    event.reply('pdfJson', data);
  });
});
