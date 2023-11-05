"use client"

import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    return (
        <main className='h-screen flex flex-col justify-center items-center gap-4'>
            <h1 className='text-black font-black text-3xl'>{error.message}</h1>
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
