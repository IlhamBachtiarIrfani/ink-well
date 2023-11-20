"use client"

import BoxPlotChart from '@/components/chart/box-plot.chart';
import React from 'react';

interface OverviewProps {
    data: any
}

export default function Overview(props: OverviewProps) {
    const labels = [
        'All',
        ...props.data.question.map((item: any, index: number) => {
            return "Question " + (index + 1)
        })
    ]

    const data: number[][] = [
        [
            props.data.score.q1Score * 100,
            props.data.score.q3Score * 100,
            props.data.score.minScore * 100,
            props.data.score.maxScore * 100,
            props.data.score.q2Score * 100,
        ],
        ...props.data.question.map((item: any) => {
            return [
                item.score.q1Score * 100,
                item.score.q3Score * 100,
                item.score.minScore * 100,
                item.score.maxScore * 100,
                item.score.q2Score * 100,
            ]
        }),
    ]

    return (
        <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
            <h1 className='flex-1 text-5xl font-black'>Score Overview</h1>
            <p className='text-gray-500 max-w-3xl'>Shows the lowest and highest scores, the most common score (median), and how spread out the scores are. It’s like a scoreboard that gives you a quick overview of everyone’s performance.</p>
            <div className='w-full aspect-[21/9] max-h-96'>
                <BoxPlotChart labels={labels} data={data} />
            </div>
        </div>
    );
}
