import { tasks_v1 } from "googleapis";
import React, { useEffect, useState } from "react";
import { Col, Modal, ModalFooter, Row, Stack } from "react-bootstrap";
import { BsArrowLeft, BsArrowRight, BsFillTrashFill, BsPlusLg, BsXLg } from "react-icons/bs";
import { formatDate, formatTime } from "../util/converter";
import SimpPicker from "./SimpPicker";
import './TaskModal.css'

interface Props {
    show: boolean,
    onHide: () => void
    task: tasks_v1.Schema$Task | undefined
    updateTask: (item: tasks_v1.Schema$Task) => void
    deleteTask: (taskId: string) => void
}

export default function TaskModal({ show, onHide, task, updateTask, deleteTask }: Props) {

    const [title, setTitle] = useState<string>()
    const [notes, setNotes] = useState<string>()
    const [time, setTime] = useState<string>()

    const [setup, showSetup] = useState<boolean>(false)

    const deleteNow = () => {

        if (task) {
            deleteTask(task.id ? task.id : '')
            onHide()
        }

    }

    const handleSetup = () => {
        showSetup(true)
    }

    useEffect(() => {

        if (task?.notes) {
            setTitle(task.title ? task.title : '')
            setNotes(task.notes ? JSON.parse(task.notes).notes : '')

            const total = JSON.parse(task.notes).time

            if (total) {
                setTime(formatTime(total))
            }

        }
    }, [task])

    useEffect(() => {
        if (notes && task) {
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
        <Modal centered show={show} onHide={onHide}>
            <Modal.Body className='modal-content' style={{ fontFamily: 'WantedSans', fontWeight: 'bolder' }}>
                <Row style={{ height: '5vh', marginBottom: '3px', overflow:'hidden'}}>
                    <Col xs={9}>
                        <h4>{title}</h4>
                    </Col>
                    <Col xs={3} style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                        <BsXLg className="item-btn" type="button" onClick={onHide}/>
                    </Col>
                </Row>
                <Row>
                    <div style={{ fontSize: '0.7rem' }}>{time} 동안 집중 중...</div>
                </Row>
                <Row style={{ overflow: 'hidden', height: '65vh' }}>
                    {!setup ?
                        <Col xs={12} className={`${!setup ? 'slide-in-blurred-left' : ''}`}>
                            <textarea className='modal-content' placeholder="메모를 작성하세요." rows={15} value={notes ? notes : ''} onChange={(e) => setNotes(e.target.value)}></textarea>
                        </Col> : <SettingAndDetail setup={setup} task={task} updateTask={updateTask} />
                    }
                </Row>
            </Modal.Body>
            <ModalFooter>
                {!setup ? <BsArrowRight className="item-btn" type="button" onClick={() => handleSetup()} /> :
                    <BsArrowLeft className="item-btn" type="button" onClick={() => showSetup(false)} />}
                <BsFillTrashFill className="item-btn" type="button" onClick={() => deleteNow()} />
            </ModalFooter>
        </Modal>)
}


function SettingAndDetail({ setup, task, updateTask }: { setup: boolean, task: tasks_v1.Schema$Task | undefined, updateTask: (item: tasks_v1.Schema$Task) => void }) {

    const [taskHour, setTaskHour] = useState<number>(0)
    const [taskMin, setTaskMin] = useState<number>(0)

    const [createdTime, setCreatedTime] = useState<string>()
    const [completedTime, setCompletedTime] = useState<string>()

    const addTag = () => {

    }


    useEffect(() => {
        if (task?.updated)
            setCreatedTime(task?.updated)

        if (task?.completed)
            setCompletedTime(task?.completed)
    }, [])


    return (
        <Col xs={12} className={`${setup ? 'slide-in-blurred-right' : ''} setting`} style={{ width: '100%', height: '100%' }}>
            <Stack gap={5}>
                <Row>
                    <h5>Tags</h5>
                    <div style={{ paddingRight: 'calc(var(--bs-gutter-x) * .5)', paddingLeft: 'calc(var(--bs-gutter-x) * .5)' }}>
                        <BsPlusLg type='button' className="item-btn" style={{ width: '40px', fontSize: '1.2rem' }} />
                    </div>
                </Row>
                <Row>
                    <h5>Details</h5>
                    <div>최종수정일시 {formatDate(createdTime)}</div>
                    <div>완료일시 {formatDate(completedTime)}</div>
                </Row>
                <Row>
                    <h5>Settings</h5>
                    <div style={{ display: 'flex' }}>
                        {<SimpPicker title="마감시간" gap='1px'>
                            <SimpPicker.Column key="hour" value={taskHour} onChange={setTaskHour} unit="시">
                                {
                                    Array.from({ length: 24 }, (_, index) => (
                                        <SimpPicker.Item key={"hour-" + index} value={String(index).padStart(2, '0')} />
                                    ))
                                }
                            </SimpPicker.Column>
                            <SimpPicker.Column key="min" value={taskMin} onChange={setTaskMin} unit="분">
                                {
                                    Array.from({ length: 60 }, (_, index) => (
                                        <SimpPicker.Item key={"min-" + index} value={String(index).padStart(2, '0')} />
                                    ))
                                }
                            </SimpPicker.Column>
                        </SimpPicker>}
                    </div>
                    <div style={{ display: 'none' }}>제어창 추가</div>
                </Row>
            </Stack>
        </Col>
    )
}

