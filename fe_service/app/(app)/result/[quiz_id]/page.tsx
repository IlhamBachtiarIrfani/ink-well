"use server"

import React from 'react';
import { getLoginCookies } from '@/app/action';
import ScoreDistribution from './result.score-distribution';
import Overview from './result.overview';
import Progress from './progress';
import QuestionItem from './result.question.item';
import ScoreList from './result.score-list';
import ResultRank from './result.rank';
import { UserData } from '@/entities/user.entity';

interface PercentageCardProps {
    title: string,
    value: number,
}

function PercentageCard(props: PercentageCardProps) {
    return (
        <div className='flex-1 relative px-10 py-8 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-2 z-10 overflow-hidden'>
            <p className='text-gray-400'>{props.title}</p>
            <h1 className='text-5xl font-black'>
                {(props.value * 100).toFixed(1)}
                <span className='text-xl ml-1 text-red-400'>%</span>
            </h1>
        </div>
    )
}

async function getData(userData: UserData, id: string) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },
        cache: 'no-cache'
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}scoring/${id}`, requestOptions);
    const data = await response.json();

    if (!response.ok && response.status != 400) {
        throw new Error(data.message)
    }

    return { data: data.data, isInProgress: response.status == 400 };
}

interface ResultQuizPageProps {
    params: {
        quiz_id: string
    }
}

export default async function Page(props: ResultQuizPageProps) {
    const userData = await getLoginCookies()
    const { data, isInProgress } = await getData(userData!, props.params.quiz_id)

    if (isInProgress) {
        return <Progress exam_id={props.params.quiz_id} />
    } else {
        return (
            <main className='container max-w-7xl px-5 mx-auto flex flex-col py-8 gap-8'>
                <ResultRank data={data.exam_access} title={data.title} />

                <div className='flex gap-8'>
                    <PercentageCard title='Average Score' value={data.score.avgScore} />
                    <PercentageCard title='Min Score' value={data.score.minScore} />
                    <PercentageCard title='Max Score' value={data.score.maxScore} />
                    <PercentageCard title='Pass Rate' value={data.score.pass_rate} />
                </div>


                <div className='grid grid-cols-2 gap-8'>
                    <Overview data={data} />
                    <ScoreDistribution data={data.score} />

                    {data.question.map((item: any, index: number) => {
                        return (
                            <QuestionItem key={item.id} data={item} index={index} />
                        )
                    })}
                </div>

                <ScoreList exam_id={props.params.quiz_id} data={data.exam_access} />
            </main>
        );
    }
}
