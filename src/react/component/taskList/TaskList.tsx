import { tasks_v1 } from "googleapis"
import { ListFilter } from "../Main"
import { Row } from "react-bootstrap"
import ActionTask from "./Task"
import React from "react"
import './TaskList.css'

interface Props {
    list: tasks_v1.Schema$Task[]
    listFilter: ListFilter
    selectedItem: tasks_v1.Schema$Task
    setTask: (value: tasks_v1.Schema$Task) => void
    clickItem: (value: tasks_v1.Schema$Task) => void
    updateTask: (value: tasks_v1.Schema$Task) => void
    deleteTask: (value: string) => void
}

export default function TaskList({ list, listFilter, selectedItem, updateTask, clickItem, setTask,deleteTask }: Props) {
    return (
        <Row className='task-list'>

            {list.length > 0 &&
                Array.from(list)
                    .filter(task => task.status === listFilter)
                    .map((value, index) => {
                        return <ActionTask key={`actionList + ${value.id}`}
                            task={value}
                            updateTask={updateTask}
                            isFocused={selectedItem.id == value.id ? true : false}
                            onFocus={() => clickItem(value)}
                            selectTask={() => setTask(value)}
                            deleteTask={()=> deleteTask(value.id ? value.id : '')} />
                    })}

            {list.length == 0 &&
                <div className='nothing'>
                    <h2>NOTHING</h2>
                    <span>할 일 목록을 추가보세요.</span>
                </div>}
        </Row>
    )
}