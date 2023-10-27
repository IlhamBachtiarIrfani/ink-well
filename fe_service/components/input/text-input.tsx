"use client"
import React, { useRef } from 'react'

interface TextInputComponentProps {
    placeholder: string,
    icon: JSX.Element
}

export default function TextInputComponent(props: TextInputComponentProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function onComponentClick(event: React.MouseEvent) {
        event.preventDefault();

        inputRef.current?.focus();
    }

    return (
        <div className='group text-white border border-white rounded-full flex items-center px-5 gap-4 cursor-text' onClick={onComponentClick}>
            {props.icon}
            <input
                ref={inputRef}
                className='bg-transparent h-10 w-full focus:outline-none border-none'
                type='text'
                placeholder={props.placeholder}
            />
        </div>
    )
}
