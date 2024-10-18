const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  toggleFixWindow: () => ipcRenderer.invoke('toggle-fix-window'),
  getAllWindows: () => ipcRenderer.invoke('get-all-windows'),
  loginWithGoogle: async (CLEINT_ID,CLEINT_SECRET) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('google-login-request',CLEINT_ID,CLEINT_SECRET); 

      ipcRenderer.once('google-login-response', (event, result) => {
        resolve(result); 
      });
    });
  },
  exit: () => {
    ipcRenderer.send('exit')
  },
  getTasks: async () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('get-tasks-request')

      ipcRenderer.once('get-tasks-response', (event, result) => {
        resolve(result)
      })
    })
  },
  addTask: async (task) => {
    return new Promise((resolve,reject)=>{
      ipcRenderer.send('add-task-request',task)

      ipcRenderer.once('add-task-response', (event,result) => {
        resolve(result)
      })
    })
  },
  updateTask: async (task) => {
    return new Promise((resolve,reject)=>{
      ipcRenderer.send('update-task-request',task)

      ipcRenderer.once('update-task-response', (event,result) => {
        resolve(result)
      })
    })
  },
  deleteTask: async (taskId) => {
    return new Promise((resolve,reject) => {
      ipcRenderer.send('delete-task-request',taskId)

      ipcRenderer.once('delete-task-response',(event,result) => {
        resolve(result)
      })
    })
  },
  batchUpdate: async (tasks) => {
    return new Promise((resolve,reject) => {
      ipcRenderer.send('batch-request',tasks)

      ipcRenderer.once('batch-response', (event,result) => {
        resolve(result)
      })
    })
  }
});




