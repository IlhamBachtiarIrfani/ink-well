"use server"

import QuizItem from '@/components/item/quiz.item'
import { QuizEntity } from '@/entities/quiz.entity';
import React from 'react'
import { getLoginCookies } from '@/app/action';
import { UserData } from '@/entities/user.entity';
import Custom from './custom';
import BreadcrumbsComponent from '@/components/common/breadcrumbs';

async function getData(userData: UserData) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },

    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message)
    }

    const examData: QuizEntity[] = data.data;
    return examData;
}

export default async function QuizPage() {
    const userData = await getLoginCookies()
    const data = await getData(userData!)

    return (
        <div className='container max-w-5xl px-5 mx-auto flex flex-col py-8 gap-8'>
            <BreadcrumbsComponent
                links={[
                    {
                        name: 'Home',
                        href: `${process.env.NEXT_PUBLIC_BASE_URL}`
                    },
                    {
                        name: 'Quiz',
                        href: `${process.env.NEXT_PUBLIC_BASE_URL}quiz`
                    },
                    {
                        name: 'List',
                    }
                ]}
            />
            <Custom />

                {data.length == 0 && <p>You don&apos;t have quiz yet! </p>}

            {
                data.map((item) => {
                    return <QuizItem key={item.id} item={item} />
                })
            }
        </div>
    )
}
