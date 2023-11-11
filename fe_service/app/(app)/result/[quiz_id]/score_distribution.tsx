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

const labels = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'];

class LaplaceSmoothing {
    private counts: Map<number, number>;
    private total: number;

    constructor() {
        this.counts = new Map<number, number>();
        this.total = 0;
    }

    public add(value: number) {
        this.counts.set(value, (this.counts.get(value) || 0) + 1);
        this.total++;
    }

    public probability(value: number) {
        return ((this.counts.get(value) || 0) + 1) / (this.total + this.counts.size);
    }
}

export default function ScoreDistribution() {

    const data = labels.map(() => faker.number.int({ min: 0, max: 40 }))

    const smoothData = data;

    return (
        <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden '>
            <h1 className='text-xl mb-2 font-black'>Score Distribution</h1>
            <div className='flex-1 w-full aspect-video max-h-96'>
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
                                    },
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                                    },
                                }
                            }
                        }
                    }}
                    data={{
                        labels,
                        datasets: [
                            {
                                type: 'line' as const,
                                label: 'Dataset 2',
                                data: smoothData,
                                borderColor: 'rgb(255, 99, 132)',
                                tension: .3,
                                borderDash: [4, 8],
                                borderCapStyle: 'round',
                                fill: false,
                                pointStyle: 'circle',
                                pointBackgroundColor: 'rgb(255, 99, 132)',
                                pointRadius: 4,
                            },
                            {
                                label: 'Dataset 1',
                                data: data,
                                backgroundColor: '#70DAE5',
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
