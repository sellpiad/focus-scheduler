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

    const [isWindowTop, setIsWindowTop] = useState<boolean>()

    // 윈도우 고정
    const toggleFixWindow = async () => {

        window.electron.toggleFixWindow()
            .then((value) => {
                setIsWindowTop(value)
            }).catch((err) => {
                console.log(err)
            })
    }


    return (

        <Row className='title-bar'>
            <Col className="title" xs={7}>
                <strong >Scheduler</strong>
            </Col>
            <Col className='fix-btn' xs={3}>
                <button className={`${isWindowTop ? 'clicked' : ''}`} onClick={() => toggleFixWindow()} >상단고정</button>
            </Col>
            <Col className='control-box' xs={2}>
                <BsDashLg className='minimize-btn' type="button" onClick={() => window.electron.setMinimizeWindow()} />
                <BsFront className='maximize-btn' type="button" onClick={() => window.electron.toggleMaximizeWindow()} />
                <CloseButton type="button" onClick={() => window.electron.exit()} />
            </Col>
        </Row>

    )
}