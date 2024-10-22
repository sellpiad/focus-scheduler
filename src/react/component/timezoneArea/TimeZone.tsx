import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import SimpPicker from "./SimpPicker";
import './TimeZone.css'

export default function TimeZone() {

    const [dayOutHour, setDayOutHour] = useState<number>(0)
    const [dayOutMin, setDayOutMin] = useState<number>(0)

    const [availTime, setAvailTime] = useState<String>('')
    const [isHover, setIsHover] = useState<boolean>(false)

    const start = useRef<number>(0)
    const end = useRef<number>(0)


    // 시간 변환
    const getTimestampForToday = (hour: number, minute: number) => {
        const now = new Date();
        now.setHours(hour, minute, 0, 0);

        return now.getTime();
    }

    // 작업 시간 타이머
    const timer = () => {

        if (Date.now() > start.current && Date.now() < end.current) {

            const remaining = end.current - Date.now()

            const seconds = String(Math.floor((remaining / 1000) % 60)).padStart(2, '0')
            const minutes = String(Math.floor((remaining / (1000 * 60)) % 60)).padStart(2, '0')
            const hours = String(Math.floor((remaining / (1000 * 60 * 60)) % 24)).padStart(2, '0')

            setAvailTime(hours + "시간 " + minutes + "분 " + seconds + "초")
        } else {
            setAvailTime('타임아웃!')
        }

        requestAnimationFrame(timer)
    }

    useEffect(() => {

        const timeFrame = requestAnimationFrame(timer)

        return () => cancelAnimationFrame(timeFrame)

    }, [])

    useEffect(() => {

        end.current = getTimestampForToday(dayOutHour, dayOutMin)

    }, [dayOutHour, dayOutMin])


    return (
        <Row className='timezone'>
            <Col className='time' xs={12}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                {!isHover ? <Row>
                    <strong>{availTime}</strong>
                </Row> :
                    <Row>
                        <SimpPicker gap="10px">
                            <SimpPicker.Column key="hour" value={dayOutHour} onChange={setDayOutHour} unit="시">
                                {
                                    Array.from({ length: 24 }, (_, index) => (
                                        <SimpPicker.Item key={"hour-" + index} value={String(index).padStart(2, '0')} />
                                    ))
                                }
                            </SimpPicker.Column>
                            <SimpPicker.Column key="min" value={dayOutMin} onChange={setDayOutMin} unit="분">
                                {
                                    Array.from({ length: 60 }, (_, index) => (
                                        <SimpPicker.Item key={"min-" + index} value={String(index).padStart(2, '0')} />
                                    ))
                                }
                            </SimpPicker.Column>
                        </SimpPicker>
                        <strong style={{ textDecoration: 'underline', fontSize: '0.7rem', color: '#424549' }}>마감시간을 설정하세요.</strong>
                    </Row>}
            </Col>
        </Row>
    )
}