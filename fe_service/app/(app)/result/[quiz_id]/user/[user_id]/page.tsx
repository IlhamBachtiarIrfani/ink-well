"use server"

import React from 'react';
import { getLoginCookies } from '@/app/action';
import { UserData } from '@/entities/user.entity';
import UserItem from './user.item';
import Image from 'next/image';
import ActionItem from './action.item';


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
            <div className='sticky left-0 right-0 top-28 z-20 flex gap-8 items-center bg-white p-10 py-8 rounded-2xl border-b-4 border-black'>
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
                    {(data.score.score_percentage * 100).toFixed(1)}
                    <span className='text-xl text-red-400'>
                        <span className='mx-1'>/</span>
                        100
                    </span>
                </p>
            </div>
            {
                data.exam.question.map((item: any, index: number) => {
                    return (
                        <UserItem key={item.id} item={item} index={index} />
                    )
                })
            }
            <div className='flex flex-col gap-8 bg-white p-10 rounded-2xl border-b-4 border-black'>
                <h1 className='font-black text-3xl'>User Activity History</h1>
                <table className="w-full table-auto text-sm text-left">
                    <thead>
                        <tr className='bg-black text-white'>
                            <th className='rounded-s-lg px-3 py-2'>Action</th>
                            <th className='px-3 py-2'>Detail</th>
                            <th className='rounded-e-lg px-3 py-2'>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.action.map((item: any) => {
                                return (
                                    <ActionItem key={item.id} action={item.action} detail={item.detail} createdAt={item.created_at} />
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </main>
    );
}
