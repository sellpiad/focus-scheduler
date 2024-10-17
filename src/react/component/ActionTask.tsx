import { tasks_v1 } from 'googleapis';
import React, { Children, useEffect, useRef, useState } from "react";
import { BsAlarmFill, BsArrowCounterclockwise, BsPencilFill, BsTrophyFill } from "react-icons/bs";
import './Active.css';
import { formatTime } from '../util/converter';

interface TaskProps {
    task: tasks_v1.Schema$Task // 작업 객체
    updateTask: (item: tasks_v1.Schema$Task) => void // 작업 업데이트
}

interface FocusProps {
    isFocused: boolean // 해당 작업을 작업 중인지, 아닌지.
    onFocus: () => void // 해당 작업을 포커스
}

interface Props extends TaskProps, FocusProps {
    showModal: () => void
}

export default function ActionTask({ task, updateTask, isFocused, onFocus, showModal }: Props) {

    /**
     * UI 관련 state
     */
    const [background, setBackground] = useState<string>()
    const [isHover, setIsHover] = useState<boolean>(false)


    /**
     * 시간 관련 state
     */
    const [accTime, setAccTime] = useState<number>(0) // 기존 누적 시간

    /**
     * Data 관련 state
     */
    const [title, setTitle] = useState<string>('')

    /**
     * requestAnimation 용 Ref
     */
    const aniNum = useRef<number>(0) // requestAnimationFrame 핸들 넘버
    const lastUpdateTime = useRef<number>(Date.now()) // 마지막으로 작업 시간 업데이트 한 시간


    /**
     * UI 관련 메소드
     */

    const handleMouseEnter = () => {
        setBackground('#e1e1e1')
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setBackground('transparent')
        setIsHover(false)
    }


    /**
     * 시간 관련 메소드
     */

    const timer = () => {

        const delay = Date.now() - lastUpdateTime.current

        if (delay >= 1000) {
            lastUpdateTime.current = Date.now()
            setAccTime(prev => prev + delay)
        }

        aniNum.current = requestAnimationFrame(timer)
    }


    // UI 관련 업데이트
    useEffect(() => {

        if (isFocused) {
            lastUpdateTime.current = Date.now()
            aniNum.current = requestAnimationFrame(timer)
        } else {
            cancelAnimationFrame(aniNum.current)
        }

        return () => { cancelAnimationFrame(aniNum.current) }

    }, [isFocused])


    // Task 관련 업데이트
    useEffect(() => {

        if (task && task.title != null) {
            setTitle(task.title)
        }

        if (task && task.notes) {
            setAccTime(JSON.parse(task.notes).time)
        }

    }, [task])


    // Title 관련 업데이트
    useEffect(() => {

        if (title) {
            const updatedTask = { ...task, title: title }
            updateTask(updatedTask)
        }

    }, [title])


    // 누적 시간 관련 업데이트
    useEffect(() => {

        if (accTime && task) {
            const updatedTask = {
                ...task, notes: JSON.stringify({
                    ...JSON.parse(task.notes || '{}'),
                    time: accTime
                })
            }
            updateTask(updatedTask)
        }

    }, [accTime])


    return (
        <div
            className='Active-item'
            style={{ background: background }}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
        >
            <div className='item-alram' onClick={onFocus}>
                {isFocused && <BsAlarmFill className='jello-horizontal' />}
            </div>

            <input className='item-input' placeholder="Summary" type="text" value={title} onChange={(e) => setTitle(e.target.value)}></input>

            {isHover ?
                <div className='item-btn-box'>
                    <EditBtn showModal={showModal} />
                    <CompleteBtn task={task} updateTask={updateTask} />
                </div>
                :
                <div className='item-time'>
                    <span>{formatTime(accTime)}</span>
                </div>}

        </div>
    )
}


function EditBtn({ showModal }: { showModal: () => void }) {
    return (
        <BsPencilFill className='item-btn' type="button" onClick={showModal} />
    )
}

function CompleteBtn({ task, updateTask }: TaskProps) {

    //작업 삭제 및 완료 관련 메소드
    const handleComplete = () => {
        const completedTask: tasks_v1.Schema$Task = { ...task, status: 'completed' }

        updateTask(completedTask)
    }

    return (
        <BsTrophyFill className='item-btn' type="button" onClick={handleComplete} />
    )
}

function ReturnBtn({ task, updateTask }: TaskProps) {

    // 작업을 액티브로 전환
    const handleReturn = () => {
        const completedTask: tasks_v1.Schema$Task = { ...task, status: 'needsAction' }

        updateTask(completedTask)
    }

    return (
        <BsArrowCounterclockwise className='item-btn' type="button" onClick={handleReturn} />
    )
}

