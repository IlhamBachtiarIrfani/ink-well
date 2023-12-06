'use server'
import { getLoginCookies } from '@/app/action';
import { QuizEntity } from '@/entities/quiz.entity';
import { UserData } from '@/entities/user.entity';
import { notFound } from 'next/navigation';
import React from 'react'
import JoinQuizClient from './client';
import ErrorPage from '@/components/common/error-page';

async function getData(userData: UserData, joinCode: string) {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${joinCode}/join`, requestOptions);
    const data = await response.json();

    if (response.status == 404) {
        return notFound()
    }

    const examData: QuizEntity = data.data;
    return { examData: examData, message: data.message };
}
interface JoinDetailPageProps {
    params: {
        join_code: string
    }
}


export default async function JoinDetailPage(props: JoinDetailPageProps) {
    const userData = await getLoginCookies()
    const { examData, message } = await getData(userData!, props.params.join_code)

    if (message != 'OK') {
        return <ErrorPage message={message} />
    }

    return (
        <JoinQuizClient token={userData!.token} quidData={examData} />
    )
}
