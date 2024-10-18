import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import { tasks_v1 } from 'googleapis';
import path from 'path'; // CommonJS 대신 ES 모듈 방식으로 가져오기
import { handleGoogleLogin } from './googleLogin'; // .ts 확장자 없이 가져오기
import { addTask, batchUpdate, deleteTask, getList, updateTask } from './googleTasks';

let browserWindow: BrowserWindow | null = null;

app.on("ready", () => {

  createWindow();

  /**
   * 구글 인증
   */

  ipcMain.on('google-login-request', async (event,CLIENT_ID:string, CLIENT_SECRET:string) => {
    try {
      const result: boolean = await handleGoogleLogin(CLIENT_ID,CLIENT_SECRET);
      event.reply('google-login-response', result);
    } catch (error) {
      console.error('로그인 오류:', error);
      event.reply('google-login-response', false);
    }
  });

  /**
   * 작업 CRUD
   */

  ipcMain.on('get-tasks-request', async (event) => {
    try {
      const tasks: tasks_v1.Schema$Task[] | undefined = await getList()
      event.reply('get-tasks-response', tasks)
    } catch (error) {
      console.error(error)
      event.reply('get-tasks-response', false)
    }
  })

  ipcMain.on('add-task-request', async (event, task: tasks_v1.Schema$Task) => {
    const result: tasks_v1.Schema$Task | undefined = await addTask(task)
    event.reply('add-task-response', result)
  })

  ipcMain.on('update-task-request', async (event, task: tasks_v1.Schema$Task) => {
    const result: tasks_v1.Schema$Task | undefined = await updateTask(task)
    event.reply('update-task-response', result)
  })

  ipcMain.on('delete-task-request', async (event, taskId: string) => {
    const result: void | undefined = await deleteTask(taskId)
    event.reply('delete-task-response', result)
  })

  ipcMain.on('batch-request', async (event, tasks: tasks_v1.Schema$Task[]) => {
    const result: void | undefined = await batchUpdate(tasks)
    event.reply('batch-response', result)
  })


  /**
   * 윈도우 조작 
   */

  ipcMain.on('exit', () => {
    browserWindow?.close()
  })

  ipcMain.handle('toggle-fix-window', async (event: IpcMainInvokeEvent) => {
    return fixWindowTop()
  })

});


function createWindow() {
  browserWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    minimizable: true,
    resizable: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV == 'development'

  console.log(process.env.NODE_ENV + ' LEVEL')

  if(isDev){
   
    browserWindow.loadURL('http://localhost:3000')
  } else{
    browserWindow.loadFile(path.join(__dirname, '../index.html'))
  }


 
}


function fixWindowTop() {

  const isAlwaysOnTop = browserWindow?.isAlwaysOnTop()

  browserWindow?.setAlwaysOnTop(!isAlwaysOnTop)

  return !isAlwaysOnTop
}

