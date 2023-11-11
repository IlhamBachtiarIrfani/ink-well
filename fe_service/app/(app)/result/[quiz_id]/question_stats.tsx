"use client"

import React, { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Plugin
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker'

ChartJS.register(
    RadialLinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface QuestionStatsProps {
    labels: string[]
}

export default function QuestionStats(props: QuestionStatsProps) {

    const data = props.labels.map(() => faker.number.float({ min: 0, max: 100 }))

    const [legend, setLegend] = useState<Array<{ text: string, color: string }>>([])

    const chartRef = useRef<ChartJS>();

    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) return;
        if (!chart.options.plugins?.legend?.labels?.generateLabels) return;

        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        setLegend(items.map((item) => (
            {
                text: item.text,
                color: item.fillStyle?.toString() ?? "black"
            }
        )));
    }, [chartRef, props.labels])



    return (
        <div className='flex-1 max-w-xs relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
            <h1 className='text-xl font-black'>Weight</h1>
            <div className='-m-5 aspect-square'>
                <Doughnut
                    ref={chartRef}
                    data={{
                        labels: props.labels,
                        datasets: [
                            {
                                label: 'Weight',
                                data: data,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 4,
                                borderRadius: 8,
                                hoverOffset: 32,
                                hoverBorderColor: 'black'
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                            padding: 20
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                displayColors: false,
                                padding: 20,
                                cornerRadius: 12,
                                titleFont: {
                                    family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                                    size: 12,
                                    weight: '400'
                                },
                                bodyFont: {
                                    family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                                    size: 20,
                                    weight: '900'
                                },
                                titleMarginBottom: 8,
                                bodySpacing: 8,
                                callbacks: {
                                    label: (item) => {
                                        return item.parsed.toFixed(2) + "%";
                                    }
                                }
                            }
                        },
                    }}
                />
            </div>
            <div className='flex items-center justify-center gap-4 flex-wrap'>
                {legend.map((item, index) => {
                    return (
                        <div key={item.text + index} className='flex gap-2 items-center'>
                            <div className='w-3 h-3 rounded' style={{ backgroundColor: item.color }} />
                            <span className='text-xs leading-none'>{item.text}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
