'use server'
import { getLoginCookies } from '@/app/action';
import { QuizEntity } from '@/entities/quiz.entity';
import { UserData } from '@/entities/user.entity';
import { notFound } from 'next/navigation';
import React from 'react'

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

    if (!response.ok) {
        throw new Error(data.message)
    }

    const examData: QuizEntity = data.data;
    return examData;
}
interface JoinDetailPageProps {
    params: {
        join_code: string
    }
}


export default async function JoinDetailPage(props: JoinDetailPageProps) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, props.params.join_code)
  return (
    <div>JoinDetailPage</div>
  )
}
