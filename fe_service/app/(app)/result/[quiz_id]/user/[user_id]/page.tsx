"use server"

import React from 'react';
import { getLoginCookies } from '@/app/action';
import { UserData } from '@/entities/user.entity';


async function getData(userData: UserData, id: string, userId: string) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}scoring/${id}/user/${userId}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data.data;
}

interface ResultQuizPageProps {
    params: {
        quiz_id: string,
        user_id: string
    }
}

export default async function Page(props: ResultQuizPageProps) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, props.params.quiz_id, props.params.user_id)

    return (
        <main className='container max-w-7xl px-5 mx-auto flex flex-col py-8 gap-8'>
            {
                data.exam.question.map((item: any) => {
                    return (
                        <div
                            key={item.id}
                            className='relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'
                        >
                            <div
                                className='rich-text-container'
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />

                            <p>{(item.response.response_score.final_score * 100).toFixed(1)}%</p>

                            <div
                                className='rich-text-container'
                                dangerouslySetInnerHTML={{ __html: item.response.content }}
                            />
                        </div>
                    )
                })
            }
        </main>
    );
}
