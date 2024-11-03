import { tasks_v1 } from "googleapis";
import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import { BsArrowLeft, BsFillPauseFill, BsFillPlayFill, BsFillTrashFill, BsFolder, BsStopFill, BsStopwatch } from "react-icons/bs";
import { formatTime } from "../../util/converter";
import SettingAndDetail from "./SettingAndDetail";
import './TaskEditor.css';

interface Props {
    task: tasks_v1.Schema$Task | undefined
    handleTimer: (task: tasks_v1.Schema$Task) => void
    updateTask: (item: tasks_v1.Schema$Task) => void
    deleteTask: (taskId: string) => void
}

export default function TaskArea({ task, handleTimer, updateTask, deleteTask }: Props) {

    const [setup, showSetup] = useState<boolean>(false)

    const [isSuppoter, showSuppoter] = useState<boolean>(false)
    const [suppoterTop, setSuppoterTop] = useState<number>(0)
    const [suppoterLeft, setSuppoterLeft] = useState<number>(0)
    const [selectionText, setSelectionText] = useState<string>('')

    const handleTextSelection = (e: React.MouseEvent<HTMLTextAreaElement>) => {

        const textarea = e.target as HTMLTextAreaElement
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const selection = textarea.value.substring(start, end)

        if (selection.length > 0) {
            setSuppoterTop(e.clientY - 70)
            setSuppoterLeft(e.clientX - 120)
            showSuppoter(true)
            setSelectionText(selection)
        } else {
            showSuppoter(false)
        }


    }

    const getNotes = () => {
        if (task && task.notes) {

            const parser = JSON.parse(task.notes)

            const notes = parser.notes

            return notes
        } else {
            return ''
        }

    }

    const updateTitle = (title: string) => {
        const updatedTask = {
            ...task, title: title
        }
        updateTask(updatedTask)
    }

    const updateNotes = (notes: string) => {

        if (!task)
            return;

        const updatedTask = {
            ...task, notes: JSON.stringify({
                ...JSON.parse(task.notes || '{}'),
                notes: notes
            })
        }
        updateTask(updatedTask)
    }

    const deleteNow = () => {

        if (task) {
            deleteTask(task.id ? task.id : '')
        }

    }


    return (
        <Row className="Task-area">

            {task &&
                <>
                    <div className="task-title-bar">
                        <input placeholder="Project Title" value={task.title ? task.title : ''} onChange={(e) => updateTitle(e.target.value)}></input>
                        <div className="d-none d-sm-flex btn-box">

                            {setup && <BsArrowLeft className="btn" type="button" onClick={() => showSetup(false)} />}
                            {!setup && <BsFolder className="btn" type="button" onClick={() => showSetup(true)} />}

                            <BsFillTrashFill className="btn" type="button" onClick={() => deleteNow()} />
                        </div>
                    </div>
                    <div className="time-bar">
                        <div className="time">{formatTime(JSON.parse(task.notes ? task.notes : '{"time":""}').time)} 동안 집중 중...</div>
                        {/*<div className="d-sm-none control-box">
                            <BsFillPlayFill className='time-btn' type="button" onClick={() => handleTimer(task)} />
                            <BsFillPauseFill className='time-btn' type="button" onClick={() => handleTimer(task)} />
                            <BsStopwatch className='time-btn' type="button" />
                        </div>*/}
                    </div>
                    {!setup && <textarea className='slide-in-blurred-right' placeholder="Content" value={getNotes()} onChange={(e) => updateNotes(e.target.value)}
                        onMouseUp={handleTextSelection}
                    />}
                    {setup && <SettingAndDetail setup={setup} task={task} updateTask={updateTask} />}
                </>}

            {!task &&
                <div className='nothing'>
                    <h2>NOTHING</h2>
                    <span>Task를 선택해주세요.</span>
                </div>
            }

            {task && <div className="task-info">
                <span className="nc-title">글자수 </span>
                <span className="nc-count">{getNotes() ? getNotes().length : 0}</span>
            </div>}
            {/*<EditorSuppoter isShow={isSuppoter} top={suppoterTop} left={suppoterLeft} setText={setSelectionText} />*/}
        </Row>
    )
}

interface SuppoterProps {
    isShow: boolean
    top: number
    left: number
    setText: (value: React.SetStateAction<string>) => void
}

function EditorSuppoter({ isShow, top, left, setText }: SuppoterProps) {

    const handleBold = () => {
        setText(prev => '<strong>' + prev + '</strong>')
    }

    return (
        <div className="Editor-suppoter" style={{ display: isShow ? 'flex' : 'none', top: top, left: left }}>
            <Form.Select style={{ padding: '0px', width: '80px', border: '0px' }}>
                <option>H1</option>
                <option>H2</option>
                <option>H3</option>
                <option>H4</option>
                <option>H5</option>
                <option>H6</option>
            </Form.Select>
            <button onClick={handleBold}>B</button>
            <button style={{ fontStyle: 'italic' }}>I</button>
            <button style={{ textDecoration: 'underline' }}>U</button>
            <Form.Control
                className="color-picker"
                type="color"
                defaultValue="#563d7c"
                title="Choose your color"
            />
        </div>
    )
}

