import { tasks_v1 } from "googleapis";
import React, { useEffect, useReducer, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import '../../electron/global.d';
import { formatDate } from "../util/converter";
import './Main.css';
import TaskControlBar from "./taskControlBar/TaskControlBar";
import TaskEditor from "./taskEditor/TaskEditor";
import TaskList from "./taskList/TaskList";
import TimeZone from "./timezoneArea/TimeZone";
import { BsBorderWidth } from "react-icons/bs";

export type ListFilter = 'needsAction' | 'completed'

// 초기 상태
const initialState: tasks_v1.Schema$Task[] = [];

// 액션 타입 정의
type Action =
    | { type: 'INIT_TASKS'; tasks: tasks_v1.Schema$Task[] }
    | { type: 'ADD_TASK'; task: tasks_v1.Schema$Task }
    | { type: 'UPDATE_TASK'; updatedTask: tasks_v1.Schema$Task }
    | { type: 'REMOVE_TASK'; id: string };

// reducer 함수 정의
const reducer = (state: tasks_v1.Schema$Task[], action: Action) => {
    switch (action.type) {
        case 'INIT_TASKS':
            return action.tasks
        case 'ADD_TASK':
            return [...state, action.task];
        case 'UPDATE_TASK':
            return state.map((task) =>
                task.id === action.updatedTask.id ? { ...task, ...action.updatedTask } : task
            );
        case 'REMOVE_TASK':
            return state.filter((task) => task.id !== action.id);
        default:
            return state;
    }
};

export default function Main() {


    const [list, dispatch] = useReducer(reducer, initialState);

    const [selectedItem, setSelectedItem] = useState<tasks_v1.Schema$Task>({ id: undefined })

    const [serverStat, setServerStat] = useState<string>()

    const [listFilter, setListFilter] = useState<ListFilter>('needsAction')

    const [onSide, setOnSide] = useState<boolean>(false)



    // 작업 추가
    const addTask = async () => {

        const task: tasks_v1.Schema$Task = {
            title: '',
            notes: ''
        }

        await window.electron.addTask(task).then((task) => {
            dispatch({ type: 'ADD_TASK', task: task });
        })
    }

    // 작업 삭제
    const deleteTask = async (taskId: string) => {

        await window.electron.deleteTask(taskId).then((res) => {
            dispatch({ type: 'REMOVE_TASK', id: taskId });
        })

    }

    // 작업 업데이트
    const updateTask = (updatedTask: tasks_v1.Schema$Task) => {
        dispatch({ type: 'UPDATE_TASK', updatedTask });
    };


    // 작업 배치 업데이트
    const syncTasks = async () => {
        await window.electron.batchUpdate(list).then((res) => {
            setServerStat(formatDate(new Date().toISOString()))
        })
    }


    // 작업 아이템 클릭
    const clickItem = (task: tasks_v1.Schema$Task) => {

        if (task.id == selectedItem.id) {
            setSelectedItem({ id: undefined })
        } else {
            setSelectedItem(task)
        }
    }

    // 작업 리스트 얻기
    const getList = async () => {
        const tasks = await window.electron.getTasks()

        if (tasks)
            dispatch({ type: 'INIT_TASKS', tasks })
    }


    useEffect(() => {

        getList()

    }, [])



    return (
        <Container className='main' fluid>
            <BsBorderWidth type='button' className='task-list-toggle-btn' onClick={() => setOnSide(prev => !prev)} />
            <Row className='content-area'>

                <Col className={`${onSide ? '' : 'd-none d-md-flex'} settings`}>
                    <Stack gap={2} className='stack'>
                        <TimeZone />
                        <TaskControlBar listFilter={listFilter} setListFilter={setListFilter} addTask={addTask} syncTasks={syncTasks} />
                        <TaskList
                            list={list}
                            selectedItem={selectedItem}
                            listFilter={listFilter}
                            clickItem={clickItem}
                            updateTask={updateTask}
                            setTask={setSelectedItem}
                            deleteTask={deleteTask}
                        />
                        <Row className='server-status'>
                            <Col xs={8}>마지막 동기화:  {serverStat}</Col>
                        </Row>
                    </Stack>
                </Col>
                <Col className={`${onSide ? 'd-none d-md-flex' : ''} task-editor`}>
                    <TaskEditor task={list.filter(task => task.id === selectedItem.id).at(0)}
                        updateTask={updateTask}
                        deleteTask={deleteTask}></TaskEditor>
                </Col>
            </Row>
        </Container >
    )
}