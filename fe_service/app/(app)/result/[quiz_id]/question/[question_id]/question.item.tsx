"use client"

import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    LineController,
    BarController,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import { Doughnut, Chart } from 'react-chartjs-2';


ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);


ChartJS.register(ArcElement, Tooltip, Legend);

interface QuestionItemProps {
    data: any
}

export default function QuestionItem(props: QuestionItemProps) {
    const labels = Object.keys(props.data.score.distribution_data)
    const data = Object.values(props.data.score.distribution_data)

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
                <h1 className='text-5xl font-black'>Score Distribution</h1>
                <p className='text-gray-500 max-w-3xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur voluptas libero odit dolor in eaque eius, expedita et at ut fuga minus asperiores dolore autem. Aliquid at illo doloribus minus.</p>
                <div className='w-full aspect-[21/9] max-h-96'>
                    <Chart type='bar'
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        font: {
                                            family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                                            size: 10,
                                        },
                                    }
                                },
                                y: {
                                    ticks: {
                                        display: false
                                    }
                                }
                            }
                        }}
                        data={{
                            labels,
                            datasets: [
                                {
                                    type: 'line' as const,
                                    label: 'Users',
                                    data: data,
                                    borderColor: 'black',
                                    tension: .4,
                                    borderDash: [4, 8],
                                    borderCapStyle: 'round',
                                    fill: false,
                                    pointStyle: 'circle',
                                    pointBackgroundColor: 'black',
                                    borderWidth: 2,
                                    pointRadius: 4,
                                },
                                {
                                    label: 'Users',
                                    data: data,
                                    backgroundColor: '#FF7C73',
                                    borderRadius: 8,
                                    borderWidth: 0,
                                    hoverBorderWidth: 4,
                                    hoverBorderColor: 'black',
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            <div className='flex gap-8 flex-col lg:flex-row'>
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

                <div className='relative p-10 max-w-none lg:max-w-sm bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
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
        </div>
    )
}
