import React, { useState } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BsCardList, BsCloudPlus, BsPlusLg, BsTrophy } from "react-icons/bs";
import './TaskBar.css'
import { ListFilter } from "../Main";


interface Props {
    listFilter: ListFilter
    setListFilter: (filterType: ListFilter) => void
    addTask: () => void
    syncTasks: () => void
}

export default function ProjectBar({ listFilter, setListFilter, addTask, syncTasks }: Props) {

    return (
        <Row className='project-bar'>
            <Col className='title' xs={5}>
                <strong>작업 목록</strong>
            </Col>
            <Col className='control-box' xs={7}>

                {listFilter === 'needsAction' &&
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>작업 추가</Tooltip>}>
                        <div>
                            <BsPlusLg className="control-btn" type="button" onClick={() => addTask()} />
                        </div>
                    </OverlayTrigger>}

                {listFilter === 'needsAction' &&
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>완료 목록</Tooltip>}>
                        <div>
                            <BsTrophy className="control-btn" type="button" onClick={() => setListFilter('completed')} />
                        </div>
                    </OverlayTrigger>}

                {listFilter === 'completed' &&
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>작업 목록</Tooltip>}>
                        <div>
                            <BsCardList className="control-btn" type="button" onClick={() => setListFilter('needsAction')} />
                        </div>
                    </OverlayTrigger>}


                <OverlayTrigger placement="bottom" overlay={<Tooltip>서버와 동기화</Tooltip>}>
                    <div>
                        <BsCloudPlus className="control-btn" type="button" onClick={() => syncTasks()} />
                    </div>
                </OverlayTrigger>
            </Col>
        </Row>
    )
}