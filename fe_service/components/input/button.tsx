import React from 'react'

export enum ButtonType {
    DARK = 'DARK',
    LIGHT = 'LIGHT',
    RED = 'RED',
    DARK_OUTLINED = 'DARK_OUTLINED',
    SMALL_DARK = 'SMALL_DARK',
    SMALL_DARK_OUTLINED = 'SMALL_DARK_OUTLINED',
}

const baseStyle = "font-bold h-10 pl-10 pr-9 rounded-full flex items-center gap-3 hover:scale-105 transition-all"

const smallStyle = "font-bold h-8 pl-5 pr-4 rounded-full text-sm flex items-center gap-3 hover:scale-105 transition-all"

const getStyle = (type: ButtonType) => {
    switch (type) {
        case ButtonType.DARK:
            return "bg-black text-white " + baseStyle
        case ButtonType.LIGHT:
            return "bg-white text-black " + baseStyle
        case ButtonType.RED:
            return "bg-red-400 text-white " + baseStyle
        case ButtonType.DARK_OUTLINED:
            return "border border-black text-black " + baseStyle
        case ButtonType.SMALL_DARK:
            return "bg-black text-white " + smallStyle
        case ButtonType.SMALL_DARK_OUTLINED:
            return "border border-black text-black " + smallStyle
        default:
            return baseStyle
    }
}

interface ButtonComponentProps {
    title: string
    type: ButtonType
    icon?: JSX.Element
}

export default function ButtonComponent(props: ButtonComponentProps) {
    return (
        <button className={getStyle(props.type)}>
            <span>{props.title}</span>
            {props.icon}
        </button>
    )
}
