"use client"
import React from 'react'

export type ButtonType = 'DARK' | 'LIGHT' | 'RED' | 'DARK_OUTLINED' | 'SMALL_DARK' | 'SMALL_DARK_OUTLINED'

const baseStyle = "font-bold h-10 pl-10 pr-9 rounded-full whitespace-nowrap flex items-center gap-3 hover:scale-105 transition-all"

const smallStyle = "font-bold h-8 pl-5 pr-4 rounded-full whitespace-nowrap text-sm flex items-center gap-3 hover:scale-105 transition-all"

const getStyle = (type: ButtonType) => {
    switch (type) {
        case 'DARK':
            return "bg-black text-white " + baseStyle
        case 'LIGHT':
            return "bg-white text-black " + baseStyle
        case 'RED':
            return "bg-red-400 text-white " + baseStyle
        case 'DARK_OUTLINED':
            return "border border-black text-black " + baseStyle
        case 'SMALL_DARK':
            return "bg-black text-white " + smallStyle
        case 'SMALL_DARK_OUTLINED':
            return "border border-black text-black " + smallStyle
        default:
            return baseStyle
    }
}

interface ButtonComponentProps {
    title: string
    type: ButtonType,
    icon?: JSX.Element
    onClick?: () => void
}

export default function ButtonComponent(props: ButtonComponentProps) {

    function onButtonClick(event: React.MouseEvent) {
        if (!props.onClick) return

        event.preventDefault();
        props.onClick();
    }

    return (
        <button className={getStyle(props.type)} onClick={onButtonClick}>
            <span>{props.title}</span>
            {props.icon}
        </button>
    )
}
