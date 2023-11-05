"use client"

import React from 'react'

interface NumberInputComponentProps {
    icon: React.ReactNode
    desc: string
    min: number
    max: number
    value?: number
    onChange?: (value: number) => void
}

export default function NumberInputComponent(props: NumberInputComponentProps) {
    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()

        if (props.onChange) {
            props.onChange(+event.target.value ?? 1)
        }
    }

    return (
        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
            {props.icon}
            <input
                type='number'
                min={props.min}
                max={props.max}
                className='w-full focus:outline-none h-10'
                value={props.value}
                onChange={onInputChange}
            />
            <p className='flex-none whitespace-nowrap'>
                {props.desc}
            </p>
        </div>
    )
}
