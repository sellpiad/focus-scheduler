import React, { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import './SimpPicker.css'

interface PickerProps {
    gap?: string
    children?: ReactNode
    title?: string
}

export default function SimpPicker({ title, gap, children }: PickerProps) {

    return (
        <div className='simpPicker' style={{columnGap: gap && gap}}>
            {title && <div style={{
                alignContent: "center",
                fontWeight: 'bolder'
            }}>{title}</div>}
            {children}
        </div>
    )
}

interface ColumnProps {
    value: number
    onChange: (prop: any) => void
    children?: ReactNode
    style?: React.CSSProperties | undefined
    unit?: string
}

function Column({ value, onChange, children, style, unit }: ColumnProps) {

    const [posY, setPosY] = useState<number>(0)
    const [isHover, setIsHover] = useState<boolean>(false)
    const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

    const childCount = React.Children.count(children)

    const handleScroll = (e: React.WheelEvent) => {

        if (e.deltaY > 0) {
            setPosY(prev => prev <= 0 ? prev + 36 : prev)
            onChange(prev => prev > 0 ? prev - 1 : prev)
        }
        else {
            setPosY(prev => prev >= -(36 * (childCount - 1)) ? prev - 36 : prev)
            onChange(prev => prev < childCount - 1 ? prev + 1 : prev)
        }
    };

    useEffect(() => {

        if (posY > 0) {
            timeoutRef.current = setTimeout(() => {
                setPosY(0)
            }, 200)
        } else if (posY === 0 && timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        } else if (posY < -(36 * (childCount - 1))) {
            timeoutRef.current = setTimeout(() => {
                setPosY(-36 * (childCount - 1))
            }, 200)
        } else if (posY === -(36 * (childCount - 1)) && timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

    }, [posY])

    useEffect(()=>{
        if(value){
            setPosY(value*-36)
        }
    },[])


    return (
        <div style={{ ...style, display: 'flex', height: '108px' }}>
            <div
                onWheel={handleScroll}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{
                    position: 'relative',
                    transitionDuration: "300ms",
                    transform: 'translateY(' + posY + 'px)',
                    textAlign: "center"
                }}
            >
                {React.Children.map(children, (child, order) => (
                    <div
                        className={`simpPicker-item`}
                        style={{
                            opacity: (order === value) || isHover ? 1 : 0,
                            fontWeight: (order === value) ? 'bolder' : 'normal',
                            transition: 'opacity fontSize transform 0.3s ease',
                            transform: (order === value) ? 'rotateX(0deg)' : ((order === value - 1) ? 'rotateX(50deg)' : 'rotateX(-50deg)'),
                        }}
                    >
                        {child}
                    </div>
                ))}
            </div>
            {unit && <div style={{ fontWeight: 'bolder', fontSize: '1rem', marginTop: '6px', paddingLeft:'4px' }}>
                {unit}
            </div>}

        </div>
    )
}

interface ItemProps {
    value:string
}

function Item({ value }:ItemProps) {
    return (
        <>
            {value}
        </>
    )
}


SimpPicker.Column = Column
SimpPicker.Item = Item
