'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { QuizEntity } from '@/entities/quiz.entity'
import ButtonComponent from '@/components/input/button'
import { useLayout } from '@/components/common/layout/base.layout'
import Link from 'next/link'
import { UserData } from '@/entities/user.entity'
import { useRouter } from 'next/navigation'
import ErrorDisplay from '@/components/common/error-display'
import CountdownComponent from '@/components/common/countdown'

interface ProcessQuizProps {
    data: QuizEntity
    userCount: number,
    userData: UserData,
    startQuiz: () => void,
    finishTime: Date
}

export default function ProcessQuiz(props: ProcessQuizProps) {
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)
    const [errorData, setErrorData] = useState<any>(null)

    async function deactivate() {
        if (isLoading) return;

        setLoading(true);

        // Set the request options
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + props.userData.token
            },
        };

        setErrorData(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${props.data.id}/deactivate`, requestOptions);

            const data = await response.json();

            if (!response.ok) {
                setErrorData(data.message);
            } else {
                router.replace('/quiz/' + props.data.id)
            }

        } catch (error: any) {
            setErrorData("Internal Server Error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    const quizLink = `${process.env.NEXT_PUBLIC_BASE_URL}join/${props.data.join_code}`

    return (
        <>
            {isLoading && <p>Loading...</p>}
            <ErrorDisplay errorData={errorData} setErrorData={setErrorData} />

            <div className='relative py-16 px-14 sm:py-24 sm:px-20 bg-white border-b-4 border-black rounded-2xl flex flex-col items-center gap-10 z-10 overflow-hidden'>

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

                <h1 className='font-black text-3xl text-center'>{props.data.title}</h1>

                <div className='flex flex-col items-center'>
                    <CountdownComponent finishTime={props.finishTime} isBig />

                    <Link href={quizLink} target='_blank' className='text-center mt-3 text-red-400 underline'>
                        {quizLink}
                    </Link>
                </div>

                <div className='flex items-center gap-5'>
                    <div className='flex items-center gap-3 bg-black text-white h-10 pl-5 pr-8 py-2 rounded-full whitespace-nowrap'>
                        <span className='material-symbols-rounded'>encrypted</span>
                        <p>{props.data.join_code}</p>
                    </div>

                    <div className='flex items-center gap-3 bg-black text-white h-10 pl-5 pr-8 py-2 rounded-full whitespace-nowrap'>
                        <span className='material-symbols-rounded'>live_help</span>
                        <p>{props.data.question_count} Question</p>
                    </div>

                    <div className='flex items-center gap-3 bg-black text-white h-10 pl-5 pr-8 py-2 rounded-full whitespace-nowrap'>
                        <span className='material-symbols-rounded'>groups</span>
                        <p>{props.userCount} Participant</p>
                    </div>
                </div>
            </div>
        </>
    )
}
