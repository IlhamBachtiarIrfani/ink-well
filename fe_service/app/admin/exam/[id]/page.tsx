import { getLoginCookies } from '@/app/action'
import HeaderComponent from '@/components/common/header'
import ProtectedPage from '@/components/common/protected-page'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import React from 'react'
import ExamQuizCustomHeader from './exam-quiz-custom-header'
import { UserData } from '@/app/const'
import { ExamEntity } from '@/entities/exam'
import { notFound } from 'next/navigation'
import QuestionItem from '@/components/item/question-item'

async function getData(userData: UserData, id: string) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },
    };

    const response = await fetch('http://localhost:3000/exam/' + id, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        return undefined;
    }

    if (!data.data) {
        return notFound()
    }

    const examData: ExamEntity = data.data;
    return examData;
}

export default async function ExamQuizPage({ params }: { params: { id: string } }) {
    const userData = await getLoginCookies()
    const data = await getData(userData!, params.id)

    return (
        <ProtectedPage>
            <HeaderComponent userData={userData}>
                <ExamQuizCustomHeader />
            </HeaderComponent>
            <main className='container max-w-3xl mx-auto px-5 flex flex-col py-8 gap-8'>
                <div className='relative overflow-hidden bg-white p-10 rounded-2xl border-b-4 border-black flex flex-col gap-5'>
                    <div className='absolute rotate-45 top-4 -right-16 w-52 h-10 bg-red-400' />
                    <input
                        className='font-black text-3xl focus:outline-none'
                        placeholder='New Quiz #1'
                        value={data?.title}
                    />

                    <input
                        className='focus:outline-none'
                        placeholder='Put your quiz description here...'
                        value={data?.desc}
                    />

                    <div className='flex gap-5'>
                        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
                            <span className='material-symbols-rounded'>
                                avg_pace
                            </span>
                            <input
                                type='number'
                                min={1}
                                value={data?.duration_in_minutes}
                                className='w-full focus:outline-none h-10'

                            />
                            <p className='flex-none whitespace-nowrap'>
                                Minutes
                            </p>
                        </div>

                        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
                            <span className='material-symbols-rounded'>
                                rewarded_ads
                            </span>
                            <input
                                type='number'
                                min={1}
                                max={100}
                                value={75}
                                className='w-full focus:outline-none h-10'
                            />
                            <p className='flex-none whitespace-nowrap'>
                                % Pass Score
                            </p>
                        </div>
                    </div>
                </div>

                {
                    data?.question.map((item, index) => {
                        return <QuestionItem key={item.id} item={item} index={index + 1} />
                    })
                }
            </main>
        </ProtectedPage>
    )
}
