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
        <div onClick={onAvatarClick} className='flex gap-4 items-center cursor-pointer select-none'>
            <div className='w-10 h-10 rounded-full'>
                <div className='w-16 h-16 -m-3'>
                    <Image
                        src={props.photo_url}
                        alt={`Avatar ${props.name}`}
                        width={172}
                        height={172}
                    />
                </div>
            </div>
            <p className='font-black text-base capitalize'>{props.name}</p>
        </div>
    )
}
