import React from 'react'
import Image from 'next/image'
import JoinForm from './form'

export default function JoinQuizPage() {
    return (
        <main className='flex-1 container max-w-3xl px-5 mx-auto flex flex-col py-8 gap-8 items-center justify-center'>
            <div className='relative w-full  py-10 px-10 sm:py-24 sm:px-20 bg-white border-b-4 border-black rounded-2xl flex flex-col items-center gap-8 z-10 overflow-hidden'>

                <Image
                    className="hidden sm:block absolute top-0 bottom-0 w-auto h-full -z-10 left-0 -translate-x-3/4"
                    src="/illustration.svg"
                    alt="Ink Well Logo"
                    width={604}
                    height={453}
                    priority
                />

                <Image
                    className="hidden sm:block absolute top-0 bottom-0 w-auto h-full -z-10 right-0 translate-x-3/4"
                    src="/illustration.svg"
                    alt="Ink Well Logo"
                    width={604}
                    height={453}
                    priority
                />

                <h1 className='font-black text-7xl'>Join Exam</h1>

                <JoinForm />
            </div>
        </main>
    )
}
