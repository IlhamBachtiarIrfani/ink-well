"use client"

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Plugin,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface PluginOptions {
    rectangleColor?: string;
    rectangleBorderWidth?: number;
}

const minMaxPathPlugin: Plugin<'bar', PluginOptions> = {
    id: 'rectanglePlugin',
    beforeDatasetsDraw: (chart: ChartJS, args: any, options: PluginOptions) => {
        const ctx = chart.ctx;
        const datasets = chart.data.datasets;

        datasets.forEach((dataset, i) => {
            if (i !== 0) return;
            const meta = chart.getDatasetMeta(i);

            if (!meta.hidden) {
                meta.data.forEach((element: any, index) => {
                    // Get the data for this bar
                    const data = dataset.data[index] as number[];

                    const yScale = chart.scales['y'];

                    const minPosition = yScale.getPixelForValue(data[2])
                    const maxPosition = yScale.getPixelForValue(data[3])

                    // Calculate the x and y coordinates for the rectangle
                    const width = Math.min(element.width, 40) / 2;

                    // Set the stroke style for the rectangle
                    ctx.strokeStyle = options.rectangleColor || 'black';
                    ctx.lineWidth = options.rectangleBorderWidth || 2;

                    // Draw the top border of the rectangle
                    ctx.beginPath();
                    ctx.setLineDash([]);
                    ctx.lineCap = 'round';
                    ctx.moveTo(element.x - width, minPosition);
                    ctx.lineTo(element.x + width, minPosition);
                    ctx.stroke();

                    // Draw the center border of the rectangle
                    ctx.beginPath();
                    ctx.setLineDash([4, 4]);
                    ctx.moveTo(element.x, minPosition);
                    ctx.lineTo(element.x, maxPosition);
                    ctx.stroke();

                    // Draw the bottom border of the rectangle
                    ctx.beginPath();
                    ctx.setLineDash([]);
                    ctx.lineCap = 'round';
                    ctx.moveTo(element.x - width, maxPosition);
                    ctx.lineTo(element.x + width, maxPosition);
                    ctx.stroke();
                });
            }
        });
    },
};

const avgPathPlugin: Plugin<'bar', PluginOptions> = {
    id: 'rectanglePlugin',
    afterDatasetsDraw: (chart: ChartJS, args: any, options: PluginOptions) => {
        const ctx = chart.ctx;
        const datasets = chart.data.datasets;

        datasets.forEach((dataset, i) => {
            if (i !== 0) return;
            const meta = chart.getDatasetMeta(i);

            if (!meta.hidden) {
                meta.data.forEach((element: any, index) => {
                    // Get the data for this bar
                    const data = dataset.data[index] as number[];

                    const yScale = chart.scales['y'];

                    const avgPosition = yScale.getPixelForValue(data[4])

                    // Calculate the x and y coordinates for the rectangle
                    const width = (element.width - 8) / 2;

                    // Set the stroke style for the rectangle
                    ctx.strokeStyle = options.rectangleColor || 'black';
                    ctx.lineWidth = options.rectangleBorderWidth || 2;

                    // Draw the top border of the rectangle
                    ctx.beginPath();
                    ctx.setLineDash([]);
                    ctx.lineCap = 'square';
                    ctx.moveTo(element.x - width, avgPosition);
                    ctx.lineTo(element.x + width, avgPosition);
                    ctx.stroke();
                });
            }
        });
    },
};

interface BoxPlotChartProps {
    labels: string[]
}

export default function BoxPlotChart(props: BoxPlotChartProps) {
    return (
        <Bar
            options={{
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        displayColors: false,
                        padding: 20,
                        cornerRadius: 12,
                        xAlign: 'center',
                        yAlign: 'bottom',
                        titleFont: {
                            family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                            size: 16,
                            weight: '900'
                        },
                        bodyFont: {
                            family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                        },
                        titleMarginBottom: 12,
                        bodySpacing: 8,
                        callbacks: {
                            label: (tooltipItem) => {
                                const data: string[] = []

                                const [q1, q3, min, max, median] = tooltipItem.raw as number[]
                                data.push(`Min : ${min.toFixed(2)}%`);
                                data.push(`Max : ${max.toFixed(2)}%`);
                                data.push(`Q1  : ${q1.toFixed(2)}%`);
                                data.push(`Q2  : ${median.toFixed(2)}%`);
                                data.push(`Q3  : ${q3.toFixed(2)}%`);

                                return data;
                            },
                        }
                    }
                },
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            font: {
                                family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                            },
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            font: {
                                family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                            },
                        }
                    },
                },
            }}
            data={{
                labels: props.labels,
                datasets: [
                    {
                        label: 'Distribution Data',
                        data: props.labels.map(() => {
                            const q1 = faker.number.float({ min: 10, max: 60 })
                            const q3 = faker.number.float({ min: q1 + 10, max: 90 })


                            const min = faker.number.float({ min: 0, max: q1 - 5 })
                            const max = faker.number.float({ min: q3 + 5, max: 100 })

                            const q2 = faker.number.float({ min: q1 + 2, max: q3 - 2 })
                            return [
                                q1, q3, min, max, q2
                            ]
                        }),
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 4,
                        borderColor: 'transparent',
                        borderRadius: 12,
                        borderSkipped: false,
                        maxBarThickness: 92,
                        hoverBorderColor: 'black'
                    },
                ],
            }}

            plugins={[minMaxPathPlugin, avgPathPlugin]}
        />
    )
}
