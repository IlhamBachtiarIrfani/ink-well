"use server"

import { getLoginCookies } from '@/app/action';
import { QuizEntity } from '@/entities/quiz.entity';
import { UserData } from '@/entities/user.entity';
import { notFound } from 'next/navigation';
import React from 'react'
import WatchQuizClient from './client';

async function getData(userData: UserData, id: string) {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData.token
        },
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${id}/activate`, requestOptions);
    const data = await response.json();

    if (response.status == 400) {
        return notFound()
    } else if (!response.ok) {
        throw new Error(data.message);
    }

    if (!data.data) {
        return notFound()
    }

    const quizData: QuizEntity = data.data;
    return quizData;
}

interface WatchQuizPageProps {
    params: {
        quiz_id: string
    }
}

export default async function WatchQuizPage(props: WatchQuizPageProps) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, props.params.quiz_id)

    return (
        <main className='container max-w-5xl px-5 mx-auto flex flex-col py-8 gap-8'>
            <WatchQuizClient token={userData!.token} quizData={data} userData={userData!} />
        </main>
    )
}
