import { getTaskLists, batchUpdate, getProjectList } from './googleTasks';
import { OAuth2Client } from 'google-auth-library';
import { calendar_v3, tasks_v1 } from "googleapis";

export interface ElectronAPI {
    /*구글 로그인*/
    loginWithGoogle: (CLIENT_ID: string, CLIENT_SECRET: string) => Promise<boolean>

    /*윈도우 조작*/
    toggleFixWindow: () => Promise<any>
    toggleWidgetMode: () => Promise<boolean>
    toggleMaximizeWindow: () => void
    setMinimizeWindow: () => void

    /*구글 테스크 관련*/
    getProjectList: () => Promise<tasks_v1.Schema$TaskLists>
    getTasks: () => Promise<tasks_v1.Schema$Task[]>
    addTask: (task: tasks_v1.Schema$Task) => Promise<tasks_v1.Schema$Task>
    updateTask: (task: tasks_v1.Schema$Task) => Promise<tasks_v1.Schema$Task>
    deleteTask: (taskId: string) => Promise<void>
    batchUpdate: (tasks: tasks_v1.Schema$Task[]) => Promise<void>
    exit: () => void
}

export interface TaskNotes {
    notes: string
    time: Date
    tag: []
}

export interface WindowDetails {
    id: number
    title: string
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}
