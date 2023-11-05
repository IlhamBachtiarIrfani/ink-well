"use server"

import React from 'react'
import QuestionCreateForm from './form'
import { notFound } from 'next/navigation';
import { QuizEntity } from '@/entities/quiz.entity';
import { UserData } from '@/entities/user.entity';
import { getLoginCookies } from '@/app/action';

async function getData(userData: UserData, id: string) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${id}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    if (!data.data) {
        console.log(data)
        return notFound()
    }

    const quizData: QuizEntity = data.data;
    return quizData;
}

interface QuizQuestionCreatePageProps {
    params: {
        quiz_id: string
    }
}

export default async function QuizQuestionCreatePage(props: QuizQuestionCreatePageProps) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, props.params.quiz_id)

    return (
        <QuestionCreateForm quizData={data} userData={userData!} />
    )
}
