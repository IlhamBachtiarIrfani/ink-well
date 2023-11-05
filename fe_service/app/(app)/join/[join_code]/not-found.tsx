"use client"

import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function QuizNotFound() {
    const router = useRouter()

    return (
        <main className='grow flex flex-col justify-center items-center gap-4'>
            <h1 className='font-black text-red-400 text-9xl'>404</h1>
            <h1 className='font-black text-3xl mb-5'>Invalid Quiz Join Code</h1>

            <ButtonComponent
                title='Try Other Code'
                type='DARK'
                icon={<span className='material-symbols-rounded'>
                    east
                </span>}
                onClick={() => router.push("/join")}
            />
        </main>
    )
}
