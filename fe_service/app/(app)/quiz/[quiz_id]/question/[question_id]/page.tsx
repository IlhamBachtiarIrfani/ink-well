"use server"

import React from 'react'
import QuestionEditForm from './form'
import { notFound } from 'next/navigation';
import { QuizEntity } from '@/entities/quiz.entity';
import { UserData } from '@/entities/user.entity';
import { getLoginCookies } from '@/app/action';
import { QuestionEntity } from '@/entities/question.entity';

async function getQuestionData(userData: UserData, quiz_id: string, question_id: string) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${quiz_id}/question/${question_id}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    if (!data.data) {
        console.log(data)
        return notFound()
    }

    const questionData: QuestionEntity = data.data;
    return questionData;
}

async function getQuizData(userData: UserData, id: string) {
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

interface QuizQuestionEditPageProps {
    params: {
        quiz_id: string,
        question_id: string
    }
}

export default async function QuizQuestionEditPage(props: QuizQuestionEditPageProps) {
    const userData = await getLoginCookies()
    const quizData = await getQuizData(userData!, props.params.quiz_id)
    const questionData = await getQuestionData(userData!, props.params.quiz_id, props.params.question_id)

    return (
        <QuestionEditForm
            quizData={quizData}
            questionData={questionData}
            userData={userData!}
        />
    )
}
