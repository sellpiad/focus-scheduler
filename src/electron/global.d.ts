import { getTaskLists, batchUpdate } from './googleTasks';
import { OAuth2Client } from 'google-auth-library';
import { calendar_v3, tasks_v1 } from "googleapis";

export interface ElectronAPI {
    loginWithGoogle: () => Promise<boolean>;
    toggleFixWindow: () => Promise<any>;
    getAllWindows: () => Promise<WindowDetails[]>;
    getTasks: () => Promise<tasks_v1.Schema$Task[]>;
    addTask: (task:tasks_v1.Schema$Task) => Promise<tasks_v1.Schema$Task>,
    updateTask: (task:tasks_v1.Schema$Task) => Promise<tasks_v1.Schema$Task>
    deleteTask: (taskId:string) => Promise<void>
    batchUpdate: (tasks:tasks_v1.Schema$Task[]) => Promise<void>
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
