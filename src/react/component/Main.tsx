import { tasks_v1 } from "googleapis";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { CloseButton, Col, Container, Row, Stack } from "react-bootstrap";
import { BsArrowClockwise, BsPlusLg, BsTrophy } from "react-icons/bs";
import ActiveModal from "./ActiveModal";
import './Main.css';
import SimpPicker from "./SimpPicker";
import ActionTask from "./ActionTask";

// 초기 상태
const initialState: tasks_v1.Schema$Task[] = [];

// 액션 타입 정의
type Action =
    | { type: 'INIT_TASKS'; tasks: tasks_v1.Schema$Task[] }
    | { type: 'ADD_TASK'; task: tasks_v1.Schema$Task }
    | { type: 'UPDATE_TASK'; updatedTask: tasks_v1.Schema$Task }
    | { type: 'REMOVE_TASK'; id: string };

// reducer 함수 정의
const reducer = (state: tasks_v1.Schema$Task[], action: Action) => {
    switch (action.type) {
        case 'INIT_TASKS':
            return action.tasks
        case 'ADD_TASK':
            return [...state, action.task];
        case 'UPDATE_TASK':
            return state.map((task) =>
                task.id === action.updatedTask.id ? { ...task, ...action.updatedTask } : task
            );
        case 'REMOVE_TASK':
            return state.filter((task) => task.id !== action.id);
        default:
            return state;
    }
};

export default function Main() {

    const [dayOutHour, setDayOutHour] = useState<number>(0)
    const [dayOutMin, setDayOutMin] = useState<number>(0)

    const [availTime, setAvailTime] = useState<String>('')
    const [isHover, setIsHover] = useState<boolean>(false)

    const [list, dispatch] = useReducer(reducer, initialState);

    const [selectedItem, setSelectedItem] = useState<tasks_v1.Schema$Task>({ id: undefined })

    const [showModal, setShowModal] = useState<boolean>(false)

    const [isWindowTop, setIsWindowTop] = useState<boolean>()

    const [serverStat, setServerStat] = useState<string>()


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

    // 작업 추가
    const addTask = async () => {

        const task: tasks_v1.Schema$Task = {
            title: '',
            notes: ''
        }

        await window.electron.addTask(task).then((task) => {
            dispatch({ type: 'ADD_TASK', task: task });
        })
    }

    // 작업 삭제
    const deleteTask = async (taskId: string) => {

        await window.electron.deleteTask(taskId).then((res) => {
            dispatch({ type: 'REMOVE_TASK', id: taskId });
        })

    }

    // 작업 업데이트
    const updateTask = (updatedTask: tasks_v1.Schema$Task) => {
        dispatch({ type: 'UPDATE_TASK', updatedTask });


    };


    // 작업 배치 업데이트
    const syncTasks = async () => {
        await window.electron.batchUpdate(list).then((res) => {
            console.log("성공")
        })
    }


    // 작업 아이템 클릭
    const clickItem = (task: tasks_v1.Schema$Task) => {

        if (task == selectedItem) {
            setSelectedItem({ id: undefined })
        } else {
            setSelectedItem(task)
        }
    }

    // 작업 리스트 얻기
    const getList = async () => {
        const tasks = await window.electron.getTasks()

        if (tasks)
            dispatch({ type: 'INIT_TASKS', tasks })
    }

    // 윈도우 고정
    const toggleFixWindow = async () => {

        window.electron.toggleFixWindow()
            .then((value) => {
                setIsWindowTop(value)
            }).catch((err) => {
                console.log(err)
            })
    }

    const exitProgram = () => {
        window.electron.exit()
    }

    // 작업 수정창
    const handleModal = (task: tasks_v1.Schema$Task) => {
        setShowModal(true)
        setSelectedItem(task)
    }


    useEffect(() => {

        getList()

        const timeFrame = requestAnimationFrame(timer)

        return () => cancelAnimationFrame(timeFrame)

    }, [])

    useEffect(() => {

        end.current = getTimestampForToday(dayOutHour, dayOutMin)

    }, [dayOutHour, dayOutMin])



    return (
        <Container fluid>
            <Stack gap={2}>
                <Row className='drag-region' style={{ paddingLeft: '0px', fontSize: '0.8rem' }}>
                    <Col className='col' xs={8}>
                        <strong style={{ fontFamily: 'WantedSans' }}>Scheduler</strong>
                    </Col>
                    <Col className='col' xs={3}>
                        <button className={`fix-btn no-drag-region ${isWindowTop ? 'clicked' : ''}`} onClick={() => toggleFixWindow()}>상단고정</button>
                    </Col>
                    <Col className='col exit-btn' xs={1}>
                        <CloseButton type="button" className="no-drag-region" onClick={()=>exitProgram()} />
                    </Col>
                </Row>
                <Row style={{ height: '100px' }}>
                    <Col xs={12}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        style={{
                            textAlign: "center",
                            alignSelf: "center",
                            fontSize: '1.3rem'
                        }}>
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
                <Row>
                    <Col xs={5} style={{ paddingLeft: '18px' }}>
                        <strong>목록</strong>
                    </Col>
                    <Col xs={7} style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                        <BsPlusLg className="item-btn" type="button" onClick={() => addTask()} />
                        <BsTrophy className="item-btn" type="button" />
                        <BsArrowClockwise className="item-btn" type="button" onClick={() => syncTasks()} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} style={{ overflow: 'scroll', scrollbarWidth: 'none', maxHeight: '250px' }}>
                        {list.length > 0 ?
                            Array.from(list).map((value, index) => {
                                return <ActionTask key={`actionList + ${index}`}
                                    task={value}
                                    updateTask={updateTask}
                                    isFocused={selectedItem.id == value.id ? true : false}
                                    onFocus={() => clickItem(value)}
                                    showModal={() => handleModal(value)} />
                            }) :
                            <div className='content-nothing'>
                                <h2>NOTHING</h2>
                                <span>할 일 목록을 추가보세요.</span>
                            </div>}
                    </Col>
                </Row>
                <Row>
                    {serverStat}
                </Row>
            </Stack >

            <ActiveModal show={showModal} onHide={() => { setShowModal(false) }} task={list.filter(task => task.id === selectedItem.id).at(0)} updateTask={updateTask} deleteTask={deleteTask}></ActiveModal>
        </Container >
    )
}