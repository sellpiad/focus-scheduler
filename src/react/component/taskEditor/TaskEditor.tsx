import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import './TaskEditor.css'
import { tasks_v1 } from "googleapis";
import { formatTime } from "../../util/converter";
import { BsArrowLeft, BsFillTrashFill, BsFolder } from "react-icons/bs";
import SettingAndDetail from "./SettingAndDetail";

interface Props {
    task: tasks_v1.Schema$Task | undefined
    updateTask: (item: tasks_v1.Schema$Task) => void
    deleteTask: (taskId: string) => void
}

export default function TaskArea({ task, updateTask, deleteTask }: Props) {

    const [title, setTitle] = useState<string>()
    const [notes, setNotes] = useState<string>()
    const [time, setTime] = useState<string>('0h 0m 0s')

    const [setup, showSetup] = useState<boolean>(false)

    const deleteNow = () => {

        if (task) {
            deleteTask(task.id ? task.id : '')
        }

    }

    useEffect(() => {

        if (task?.notes) {
            setTitle(task.title ? task.title : '')
            setNotes(JSON.parse(task.notes).notes ? JSON.parse(task.notes).notes : '')

            const total = JSON.parse(task.notes).time

            if (total) {
                setTime(formatTime(total))
            }
        }
        
    }, [task])

    useEffect(() => {
        if (task) {
            console.log("타이틀 변경")
            const updatedTask = {
                ...task, title: title
            }
            updateTask(updatedTask)
        }
    }, [title])

    useEffect(() => {
        if (task) {
            const updatedTask = {
                ...task, notes: JSON.stringify({
                    ...JSON.parse(task.notes || '{}'),
                    notes: notes
                })
            }
            updateTask(updatedTask)
        }
    }, [notes])

    return (
        <Row className="Task-area">

            {task &&
                <>
                    <div className="task-title-bar">
                        <input placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                        <div className="btn-box">

                            {setup && <BsArrowLeft className="btn" type="button" onClick={() => showSetup(false)} />}
                            {!setup && <BsFolder className="btn" type="button" onClick={() => showSetup(true)} />}

                            <BsFillTrashFill className="btn" type="button" onClick={() => deleteNow()} />
                        </div>
                    </div>
                    <div className="time-bar">{time} 동안 집중 중...</div>
                    {!setup && <textarea placeholder="Content" value={notes} onChange={(e) => setNotes(e.target.value)} />}
                    {setup && <SettingAndDetail setup={setup} task={task} updateTask={updateTask} />}
                </>}

            {!task &&
                <div className='nothing'>
                    <h2>NOTHING</h2>
                    <span>Task를 선택해주세요.</span>
                </div>
            }
        </Row>
    )
}

