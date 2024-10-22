import { tasks_v1 } from "googleapis"
import React from "react"
import { useEffect, useState } from "react"
import { Col, Row, Stack } from "react-bootstrap"
import { BsPlusLg } from "react-icons/bs"
import { formatDate } from "../../util/converter"
import SimpPicker from "../timezoneArea/SimpPicker"
import './SettingAndDetail.css'

export default function SettingAndDetail({ setup, task, updateTask }: { setup: boolean, task: tasks_v1.Schema$Task | undefined, updateTask: (item: tasks_v1.Schema$Task) => void }) {

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
        <Col xs={12} className="SettingAndDetail">
            <Stack gap={5}>
                <Row style={{ display: 'none' }}>
                    <h6>Tags(업데이트 예정)</h6>
                </Row>
                <Row>
                    <h6>Details</h6>
                    <div>최종수정일시 {formatDate(createdTime)}</div>
                    <div>완료일시 {formatDate(completedTime)}</div>
                </Row>
                <Row style={{ display: 'none' }}>
                    <h6>Settings</h6>
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

