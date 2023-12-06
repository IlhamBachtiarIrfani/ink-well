"use client"

import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function JoinForm() {
    const router = useRouter()
    const [joinCode, setJoinCode] = useState("")

    function onRequestJoin() {
        router.push(`/join/${joinCode}`)
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()

        setJoinCode(event.target.value.toUpperCase())
    }
    return (
        <div className='border border-black flex gap-3 items-center h-10 rounded-full pl-3'>
            <span className='material-symbols-rounded leading-none'>encrypted</span>
            <input
                type='text'
                placeholder='XXXXXX'
                className='bg-transparent focus:outline-none w-32 tracking-wider text-xl'
                value={joinCode}
                onChange={onInputChange}
                maxLength={6}
            />

            <ButtonComponent
                type='DARK'
                title='Join Quiz'
                onClick={onRequestJoin}
                icon={<span className='material-symbols-rounded'>east</span>}
            />
        </div>
    )
}
