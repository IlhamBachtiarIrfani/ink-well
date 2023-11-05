"use server"

import { getLoginCookies } from '@/app/action';
import NumberInputComponent from '@/components/input/number.input';
import QuestionAdminItem from '@/components/item/question.admin.item';
import { QuizEntity, QuizState } from '@/entities/quiz.entity';
import { UserData } from '@/entities/user.entity';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'
import QuizEditForm from './form';
import BreadcrumbsComponent from '@/components/common/breadcrumbs';

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

    if (response.status == 400) return notFound()

    if (!response.ok) {
        throw new Error(data.message);
    }

    const quizData: QuizEntity = data.data;
    return quizData;
}

interface EditQuizPageProps {
    params: {
        quiz_id: string
    }
}

export default async function EditQuizPage(props: EditQuizPageProps) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, props.params.quiz_id)

    if (data.state != QuizState.DRAFT) {
        notFound()
    }

    return (
        <main className='container max-w-3xl mx-auto px-5 flex flex-col py-8 gap-8'>
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
                        name: 'Edit',
                    },
                    {
                        name: data.id,
                        href: `${process.env.NEXT_PUBLIC_BASE_URL}quiz/${data.id}`
                    },
                ]}
            />

            <QuizEditForm data={data} userData={userData!} />

            {
                data?.question.map((item, index) => {
                    return <QuestionAdminItem
                        key={item.id}
                        item={item}
                        userData={userData!}
                        index={index + 1}
                    />
                })
            }

            <Link href={`/quiz/${props.params.quiz_id}/question`} className='bg-white rounded-2xl flex items-center justify-center gap-3 px-5 py-8 font-black text-red-400 border-b-4 border-black'>
                <span className='material-symbols-rounded text-lg icon-bold'>
                    add
                </span>
                <span>
                    ADD QUESTION
                </span>
            </Link>
        </main>
    )
}
