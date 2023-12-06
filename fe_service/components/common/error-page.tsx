"use client"

import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'

export default function ErrorPage({ message }: { message: string }) {
    const router = useRouter()

    return (
        <main className='flex-1 container max-w-3xl px-5 mx-auto flex flex-col py-8 gap-8 items-center justify-center'>
            <h1 className='text-black font-black text-3xl capitalize'>{message}</h1>
            <div className='flex gap-3'>
                <ButtonComponent
                    title='Try Again'
                    type='DARK'
                    onClick={
                        () => {
                            router.refresh()
                        }
                    }
                />
                <ButtonComponent
                    title='Take Back Home'
                    type='DARK_OUTLINED'
                    onClick={
                        () => router.push('/')
                    }
                />
            </div>
        </main >
    )
}
