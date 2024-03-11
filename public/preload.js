const { contextBridge, ipcRenderer } = require('electron')
// import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
)
