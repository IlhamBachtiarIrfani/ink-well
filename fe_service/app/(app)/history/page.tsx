"use server"

import React from 'react'
import { getLoginCookies } from '@/app/action';
import { UserData } from '@/entities/user.entity';
import ButtonComponent from '@/components/input/button';
import HistoryQuizItem from './history.quiz.item';

async function getData(userData: UserData) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/history`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message)
        }

        const examData = data.data;
        return examData;
    } catch (error: any) {
        throw new Error(error)
    }
}

export default async function HistoryPage() {
    const userData = await getLoginCookies()
    const data = await getData(userData!)

    return (
        <div className='container max-w-5xl px-5 mx-auto flex flex-col py-8 gap-8'>
            {
                data.map((item: any) => {
                    return (
                        <HistoryQuizItem key={item.user_id + item.exam_id} item={item} />
                    )
                })
            }
        </div>
    )
}