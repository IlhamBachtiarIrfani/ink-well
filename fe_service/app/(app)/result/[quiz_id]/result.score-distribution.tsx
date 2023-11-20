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
import { faker } from '@faker-js/faker';

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

interface ScoreDistributionProps {
    data: any
}

export default function ScoreDistribution(props: ScoreDistributionProps) {

    const labels: string[] = Object.keys(props.data.distribution_data)
    const data: number[] = Object.values(props.data.distribution_data)

    return (
        <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden '>
            {/* <h1 className='text-xl mb-2 font-black'>Score Distribution</h1> */}
            <h1 className='text-5xl font-black'>Score Distribution</h1>
            <p className='text-gray-500 max-w-3xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur voluptas libero odit dolor in eaque eius, expedita et at ut fuga minus asperiores dolore autem. Aliquid at illo doloribus minus.</p>
            <div className='flex-1 w-full aspect-[21/9] max-h-96'>
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
    )
}
