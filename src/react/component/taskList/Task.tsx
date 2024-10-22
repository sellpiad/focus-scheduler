import { tasks_v1 } from 'googleapis';
import React, { useEffect, useRef, useState } from "react";
import { BsAlarmFill, BsArrowCounterclockwise, BsCheckLg, BsPencilFill, BsTrophyFill } from "react-icons/bs";
import { formatTime } from '../../util/converter';
import './Task.css';

// ActionTask 컴포넌트 애니메이션 종류
type AnimationType = 'slide-in-right' | 'slide-in-left' | undefined
type TaskStatus = 'needsAction' | 'completed'

interface TaskProps {
    task: tasks_v1.Schema$Task // 작업 객체
    updateTask: (item: tasks_v1.Schema$Task) => void // 작업 업데이트
}

interface FocusProps {
    isFocused: boolean // 해당 작업을 작업 중인지, 아닌지.
    onFocus: () => void // 해당 작업을 포커스
}

interface Props extends TaskProps, FocusProps {
    selectTask: () => void // 해당 작업을 확인
}

export default function Task({ task, updateTask, isFocused, onFocus, selectTask }: Props) {

    /**
     * UI 관련 state
     */
    const [isHover, setIsHover] = useState<boolean>(false)

    const [animationType, setAnimationType] = useState<AnimationType>(undefined)

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

    //작업 삭제 및 완료 관련 메소드
    const handleComplete = () => {

        const completedTask: tasks_v1.Schema$Task = { ...task, status: 'completed' }

        setAnimationType('slide-in-right')

        setTimeout(() => {
            updateTask(completedTask)
        }, 1600)

    }

    const handleReturn = () => {
        const retunTask: tasks_v1.Schema$Task = { ...task, status: 'needsAction' }

        setAnimationType('slide-in-left')

        setTimeout(() => {
            updateTask(retunTask)
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
            className={`ActionTask ${animationType}`}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}>

            <div className={`status-box ${task.status} jello-horizontal`} onClick={(task.status === 'needsAction') ? onFocus : () => { }}>
                {(task.status === 'needsAction' && isFocused) && <BsAlarmFill className='jello-vertical' />}
                {task.status === 'completed' && <BsCheckLg />}
            </div>

            <span
                className='title-input'
                onClick={selectTask}>{title}</span>

            {!isHover ?
                <div className='time-span'>
                    <span>{formatTime(accTime)}</span>
                </div>
                :
                <div className='control-btn-box'>
                    {task.status === 'needsAction' && <BsTrophyFill className='control-btn' type="button" onClick={handleComplete} />}
                    {task.status === 'completed' && <BsArrowCounterclockwise className='control-btn' type="button" onClick={handleReturn} />}
                </div>
            }
        </div>
    )
}
