import { OAuth2Client } from "google-auth-library";
import { batch_v1, google, tasks_v1 } from "googleapis";

const taskListTitle = 'Focus-Scheduler'

// Google Tasks API 인스턴스 생성
let tasks: tasks_v1.Tasks
let activeList: tasks_v1.Schema$TaskList | undefined

// API 인증 토큰 설정
export const setOAuth = (oAuth2Client: OAuth2Client) => {
    tasks = google.tasks({ version: 'v1', auth: oAuth2Client });
}

// 프로젝트 리스트 가져오기
export const getProjectList = async (): Promise<tasks_v1.Schema$TaskLists | undefined> => {

    try {
        const res = await tasks.tasklists.list()
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const initList = async (): Promise<tasks_v1.Schema$TaskList | undefined> => {
    try {
        const res = await tasks.tasklists.insert({
            requestBody: {
                title: taskListTitle
            }
        })
        return res.data
    } catch (error) {
        console.log(error)
    }

}

export const getList = async (): Promise<tasks_v1.Schema$Task[] | undefined> => {

    try {
        const res = await tasks.tasklists.list();
        activeList = res.data.items?.find((taskList) => taskList.title === taskListTitle);

        if (activeList) {
            return getTasks()
        } else {
            initList().then((res) => {
                activeList = res
            })
            return getTasks()
        }
    } catch (error) {
        console.log("목록 받아오기 오류 - " + error)
    }

}

const getTasks = async (): Promise<tasks_v1.Schema$Task[] | undefined> => {

    if (!activeList || !activeList.id) {
        console.log('활성 리스트가 없거나 ID가 유효하지 않습니다.');
        return;
    }

    try {
        // activeList의 ID를 사용하여 태스크 목록을 가져옵니다.
        const response = await tasks.tasks.list({
            tasklist: activeList.id // 활성 리스트의 ID로 태스크 목록을 요청
        });

        // 태스크 목록 확인
        const tasksList = response.data.items;
        if (tasksList && tasksList.length > 0) {
            return tasksList
        } else {
            console.log('이 태스크 리스트에 태스크가 없습니다.');
        }
    } catch (error) {
        console.error('태스크 목록을 가져오는 중 오류 발생:', error);
    }
}

export const addTask = async (task: tasks_v1.Schema$Task) => {

    if (!activeList || !activeList.id) {
        console.log('활성 리스트가 없거나 ID가 유효하지 않습니다.');
        return;
    }

    const promiseTask = await tasks.tasks.insert({
        tasklist: activeList.id,
        requestBody: task
    })


    return promiseTask.data

}

export const updateTask = async (task: tasks_v1.Schema$Task) => {

    if (!activeList || !activeList.id) {
        console.log('활성 리스트가 없거나 ID가 유효하지 않습니다.');
        return;
    }

    if (!task || !task.id)
        return;


    const promiseTask = await tasks.tasks.update({
        tasklist: activeList.id,
        task: task.id,
        requestBody: task
    })

    return promiseTask.data
}

export const deleteTask = async (taskId: string) => {
    if (!activeList || !activeList.id) {
        console.log('활성 리스트가 없거나 ID가 유효하지 않습니다.');
        return;
    }

    const result = await tasks.tasks.delete({
        tasklist: activeList.id,
        task: taskId
    })

    return result.data
}

export const batchUpdate = async (taskList: tasks_v1.Schema$Task[]) => {

    if (!activeList || !activeList.id) {
        console.log('활성 리스트가 없거나 ID가 유효하지 않습니다.');
        return;
    }

    taskList.forEach((task) => {
        updateTask(task)
    })

}
