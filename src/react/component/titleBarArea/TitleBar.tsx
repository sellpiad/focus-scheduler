import React, { useState } from "react";
import { CloseButton, Col, Row } from "react-bootstrap";
import './TitleBar.css'
import { BsDashLg, BsFront, BsFullscreen } from "react-icons/bs";

/**
 * 브라우저 윈도우 최상단 영역
 * 
 * [기능]
 * -프로그램 타이틀
 * -상단고정 버튼
 * -프로그램 종료 버튼.
 */

export default function TitleBar() {

    const [isWindowTop, setIsWindowTop] = useState<boolean>(false)
    const [isWidgetMode, setWidgetMode] = useState<boolean>(false)

    // 윈도우 고정
    const toggleFixWindow = async () => {

        window.electron.toggleFixWindow()
            .then((value) => {
                setIsWindowTop(value)
            }).catch((err) => {
                console.log(err)
            })
    }

    // 위젯모드(width: 300px, height: 100px)
    const toggleWidgetMode = async () => {
        window.electron.toggleWidgetMode()
            .then((status) => {
                setWidgetMode(status)
            }).catch((err) => {
                console.error(err)
            })
    }

    const toggleMaximizeWindow = () => {
        window.electron.toggleMaximizeWindow()
        setWidgetMode(false)
    }


    return (

        <Row className='title-bar'>
            <Col className="title" xs={4}>
                <strong >Scheduler</strong>
            </Col>
            <Col className='control-box' xs={8}>
                <div className='btn-box'>
                    <button className={`${isWindowTop ? 'clicked' : ''}`} onClick={() => toggleFixWindow()} >상단고정</button>
                    <button className={`${isWidgetMode ? 'clicked' : ''}`} onClick={() => toggleWidgetMode()}>위젯모드</button>
                </div>
                <BsDashLg className='minimize-btn' type="button" onClick={() => window.electron.setMinimizeWindow()} />
                <BsFront className='maximize-btn' type="button" onClick={() => toggleMaximizeWindow()} />
                <CloseButton type="button" onClick={() => window.electron.exit()} />
            </Col>
        </Row>

    )
}