const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {

  /*윈도우 조작*/
  toggleFixWindow: () => ipcRenderer.invoke('toggle-fix-window'),
  toggleMaximizeWindow: () => ipcRenderer.invoke('toggle-maximize-window'),
  setMinimizeWindow: () => ipcRenderer.invoke('set-minimize-window'),
  toggleWidgetMode: () => ipcRenderer.invoke('toggle-widget-mode'),
 
  exit: () => {
    ipcRenderer.send('exit')
  },

  /*구글 로그인*/
  loginWithGoogle: async (CLEINT_ID, CLEINT_SECRET) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('google-login-request', CLEINT_ID, CLEINT_SECRET);

      ipcRenderer.once('google-login-response', (event, result) => {
        resolve(result);
      });
    });
  },

  /*구글 테스크 관련*/
  getProjectList: async () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('get-projectList-request')

      ipcRenderer.once('get-projectList-response', (event, result) => {
        resolve(result)
      })
    })
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
    return new Promise((resolve, reject) => {
      ipcRenderer.send('add-task-request', task)

      ipcRenderer.once('add-task-response', (event, result) => {
        resolve(result)
      })
    })
  },
  updateTask: async (task) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('update-task-request', task)

      ipcRenderer.once('update-task-response', (event, result) => {
        resolve(result)
      })
    })
  },
  deleteTask: async (taskId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-task-request', taskId)

      ipcRenderer.once('delete-task-response', (event, result) => {
        resolve(result)
      })
    })
  },
  batchUpdate: async (tasks) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('batch-request', tasks)

      ipcRenderer.once('batch-response', (event, result) => {
        resolve(result)
      })
    })
  }
});




