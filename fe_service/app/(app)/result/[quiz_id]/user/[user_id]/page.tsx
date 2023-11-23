"use server"

import React from 'react';
import { getLoginCookies } from '@/app/action';
import { UserData } from '@/entities/user.entity';
import UserItem from './user.item';
import Image from 'next/image';


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
            <div className='sticky left-0 right-0 top-28 z-50 flex gap-8 items-center bg-white p-10 py-8 rounded-2xl border-b-4 border-black'>
                <div className='w-24 h-24 -m-4 select-none pointer-events-none group-hover:-rotate-12 group-hover:scale-110 transition-transform'>
                    <Image
                        src={'/avatar/' + data.user.photo_url}
                        alt={`Avatar`}
                        width={172}
                        height={172}
                    />
                </div>
                <div className='flex-1'>
                    <p className='text-2xl font-black'>{data.user.name}</p>
                    <p>{data.user.email}</p>
                </div>
                <p className='text-5xl font-black'>
                    {data.score.final_score.toFixed(1)}
                </p>
            </div>
            {
                data.exam.question.map((item: any, index: number) => {
                    return (
                        <UserItem key={item.id} item={item} index={index} />
                    )
                })
            }
        </main>
    );
}
