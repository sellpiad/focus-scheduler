import { tasks_v1 } from "googleapis"
import { Col } from "react-bootstrap"
import ActiveTask from "./ActionTask"
import './Active.css'
import React from "react"

interface Props {
    list: tasks_v1.Schema$Task[]
}

export default function taskList({ list }: Props) {
    return (
        <Col xs={12} className="TaskList">
            {Array.from(list).map((value, index) => {
                return <ActiveTask key={`actionList + ${index}`}
                    task={value}
                    updateTask={updateTask}
                    isClicked={selectedItem.id == value.id ? true : false}
                    onClick={() => clickItem(value)}
                    showModal={() => handleModal(value)} />
            })}
        </Col>
    )
}