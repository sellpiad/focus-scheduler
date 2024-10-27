import { tasks_v1 } from 'googleapis';
import React, { useEffect, useRef, useState } from "react";
import { BsAlarmFill, BsArrowCounterclockwise, BsCheckLg, BsFillEmojiDizzyFill, BsFillTrashFill, BsPencilFill, BsTrophyFill } from "react-icons/bs";
import { formatTime } from '../../util/converter';
import './Task.css';

// Task 컴포넌트 애니메이션 종류
type AnimationType = 'slide-in-right-completed' | 'slide-in-right-deleted' | 'slide-in-left' | ''
type TaskStatus = 'needsAction' | 'completed' | 'deleted' | string

interface TaskProps {
    task: tasks_v1.Schema$Task // 작업 객체
    updateTask: (item: tasks_v1.Schema$Task) => void // 작업 업데이트
}

interface TimerProps {
    isWorking: boolean 
    onWork: () => void 
}

interface Props extends TaskProps, TimerProps {
    selectTask: () => void // 해당 작업을 확인
    deleteTask: () => void // 해당 작업을 삭제
}

export default function Task({ task, updateTask, isWorking, onWork, selectTask, deleteTask }: Props) {

    /**
     * UI 관련 state
     */
    const [isHover, setIsHover] = useState<boolean>(false)
    const [animationType, setAnimationType] = useState<AnimationType>('')

    /**
     * 시간 관련 state
     */
    const [accTime, setAccTime] = useState<number>(0) // 기존 누적 시간

    /**
     * Data 관련 state
     */
    const [title, setTitle] = useState<string>('')
    const [status, setStatus] = useState<TaskStatus>(task.status ? task.status : 'needsAction')

    /**
     * requestAnimation 용 Ref
     */
    const aniNum = useRef<number>(0) // requestAnimationFrame 핸들 넘버
    const lastUpdateTime = useRef<number>(Date.now()) // 마지막으로 작업 시간 업데이트 한 시간

    /** 
    * 작업 삭제 및 완료 관련 메소드
    */
    const handleComplete = () => {

        const completedTask: tasks_v1.Schema$Task = { ...task, status: 'completed' }

        setAnimationType('slide-in-right-completed')
        setStatus('completed')

        setTimeout(() => {
            updateTask(completedTask)
        }, 1600)

    }

    const handleReturn = () => {
        const retunTask: tasks_v1.Schema$Task = { ...task, status: 'needsAction' }

        setAnimationType('slide-in-left')
        setStatus('needsAction')

        setTimeout(() => {
            updateTask(retunTask)
        }, 1000)

    }

    const handleDelete = () => {

        setAnimationType('slide-in-right-deleted')
        setStatus('deleted')

        setTimeout(() => {
            deleteTask()
        }, 1000)
    }

    /**
     * UI 관련 메소드
     */

    const handleMouseEnter = () => {

        setIsHover(true)
    }

    const handleMouseLeave = () => {

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

        if (status === 'needsAction' && isWorking) {
            lastUpdateTime.current = Date.now()
            aniNum.current = requestAnimationFrame(timer)
        } else {
            cancelAnimationFrame(aniNum.current)
        }

        return () => { cancelAnimationFrame(aniNum.current) }

    }, [isWorking])


    // Task 관련 업데이트
    useEffect(() => {

        if (task && task.title != null) {
            setTitle(task.title)
        }

        if (task && task.notes) {
            setAccTime(JSON.parse(task.notes).time)
        }

    }, [])


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
            className={`Task ${animationType}`}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}>

            <div className={`status-box ${status} jello-horizontal`} onClick={(status === 'needsAction') ? onWork : () => { }}>
                {(status === 'needsAction' && isWorking) && <BsAlarmFill className='jello-vertical' />}
                {(status === 'completed') && <BsCheckLg className='jello-vertical' />}
                {(status === 'deleted') && <BsFillEmojiDizzyFill />}
            </div>

            <div className='title' onClick={selectTask}>
                <span>{title}</span>
            </div>


            {!isHover ?
                <div className={`${isWorking ? 'on-focus' : ''} time-span`}>
                    <span>{formatTime(accTime)}</span>
                </div>
                :
                <div className='control-btn-box'>
                    {task.status === 'needsAction' && <BsTrophyFill className='control-btn' type="button" onClick={handleComplete} />}
                    {task.status === 'completed' && <BsArrowCounterclockwise className='control-btn' type="button" onClick={handleReturn} />}
                    <BsFillTrashFill className="control-btn" type="button" onClick={() => handleDelete()} />
                </div>
            }
        </div>
    )
}
