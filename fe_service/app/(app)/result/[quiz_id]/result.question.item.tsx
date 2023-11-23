'use client'
import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ButtonComponent from '@/components/input/button';
import { useRouter } from 'next/navigation';

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


interface PercentageCardProps {
    title: string,
    value: number,
}

function PercentageCard(props: PercentageCardProps) {
    return (
        <div className='flex-1 relative px-5 py-3 bg-white border border-b-4 rounded-xl flex flex-col z-10 overflow-hidden'>
            <p className='text-gray-400 text-sm'>{props.title}</p>
            <h1 className='text-4xl font-black'>
                {(props.value * 100).toFixed(1)}
                <span className='text-xl ml-1 text-red-400'>%</span>
            </h1>
        </div>
    )
}

interface QuestionItemProps {
    data: any
    index: number
}

export default function QuestionItem(props: QuestionItemProps) {
    const router = useRouter()

    const labels = Object.keys(props.data.score.distribution_data)
    const data = Object.values(props.data.score.distribution_data)

    return (
        <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
            <div className='flex gap-5 items-center'>
                <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                    <span className='material-symbols-rounded'>
                        drag_indicator
                    </span>
                </div>
                <h2 className='grow font-black text-xl text-red-400'>QUESTION {props.index + 1}</h2>
                <ButtonComponent
                    title='Detailed Analytics'
                    type='DARK'
                    onClick={() => router.push(`/result/${props.data.exam_id}/question/${props.data.id}`)}
                    icon={<span className='material-symbols-rounded text-lg'>
                        east
                    </span>}
                />
            </div>
            <div className='w-full aspect-[21/9] max-h-96'>
                <Chart type='bar'
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode:'index'
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                   
                                }
                            }
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

            <div className='flex gap-8'>
                <PercentageCard title='Average Score' value={props.data.score.avgScore} />
                <PercentageCard title='Min Score' value={props.data.score.minScore} />
                <PercentageCard title='Max Score' value={props.data.score.maxScore} />
            </div>
        </div>
    )
}
