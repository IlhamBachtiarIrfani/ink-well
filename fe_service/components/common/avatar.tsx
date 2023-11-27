"use client"

import Image from 'next/image'
import React from 'react'

interface AvatarComponentProps {
    name: string
    photo_url: string
    onClick?: () => void
}

export default function AvatarComponent(props: AvatarComponentProps) {

    function onAvatarClick(event: React.MouseEvent) {
        event.preventDefault()

        if (props.onClick) props.onClick()
    }

    return (
        <div onClick={onAvatarClick} className='group flex gap-5 items-center cursor-pointer select-none bg-gray-100 rounded-full p-1 pr-7 hover:scale-105 transition-transform'>
            <div className='w-10 h-10 rounded-full'>
                <div className='w-16 h-16 -m-3 select-none pointer-events-none group-hover:-rotate-12 group-hover:scale-110 transition-transform'>
                    <Image
                        src={props.photo_url}
                        alt={`Avatar ${props.name}`}
                        width={172}
                        height={172}
                    />
                </div>
            </div>
            <p className='font-black text-lg capitalize whitespace-nowrap'>{props.name}</p>
        </div>
    )
}
