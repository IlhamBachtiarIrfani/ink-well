"use client"

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface QuestionItemProps {
    data: any
}

export default function QuestionItem(props: QuestionItemProps) {
    return (
        <div className='flex gap-8'>
            <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
                <div className='flex gap-5 items-center'>
                    <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                        <span className='material-symbols-rounded'>
                            drag_indicator
                        </span>
                    </div>
                    <h2 className='grow font-black text-xl text-red-400'>QUESTION</h2>
                </div>
                <div
                    className='rich-text-container'
                    dangerouslySetInnerHTML={{ __html: props.data.content }}
                />

                <p className='font-black'>Answer Key :</p>
                <div
                    className='rich-text-container'
                    dangerouslySetInnerHTML={{ __html: props.data.answer_key }}
                />

            </div>

            <div className='relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
                <Doughnut
                    data={{
                        labels: Object.keys(props.data.score.criteria_weights),
                        datasets: [
                            {
                                label: 'Weight',
                                data: Object.values(props.data.score.criteria_weights).map((item: any) => item * 100),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                ],
                                borderRadius: 12,
                                borderWidth: 4,
                                hoverOffset: 12,
                                hoverBorderColor: 'black'
                            },
                        ],
                    }}
                    options={{
                        layout: {
                            padding: 12,
                        },
                        plugins: {
                            legend: {
                                display: false,
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}
