import React from 'react'

export default function QuizWaitingStateView() {
    return (
        <main className='flex-1 container max-w-3xl px-5 mx-auto flex flex-col py-8 gap-8 items-center justify-center'>
            <div className='relative w-full py-24 px-20 bg-white border-b-4 border-black rounded-2xl flex flex-col items-center gap-8 z-10 overflow-hidden'>
                <h1 className='font-black text-3xl'>
                    Waiting Admin To Start
                </h1>
            </div>
        </main>
    )
}
