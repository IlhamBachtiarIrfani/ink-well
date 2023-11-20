"use server"

import React from 'react';
import { getLoginCookies } from '@/app/action';
import { UserData } from '@/entities/user.entity';
import UserItem from './user.item';
import QuestionItem from './question.item';


async function getData(userData: UserData, id: string, questionId: string) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}scoring/${id}/question/${questionId}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data.data;
}

interface ResultQuizPageProps {
    params: {
        quiz_id: string,
        question_id: string
    }
}

export default async function Page(props: ResultQuizPageProps) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, props.params.quiz_id, props.params.question_id)

    return (
        <main className='container max-w-7xl px-5 mx-auto flex flex-col py-8 gap-8'>
            <QuestionItem data={data} />

            {
                data.response.map((item: any) => {
                    return (
                        <UserItem key={item.user_id} item={item} />
                    )
                })
            }
        </main>
    );
}
