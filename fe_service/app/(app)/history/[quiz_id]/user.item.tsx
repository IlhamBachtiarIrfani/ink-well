'use client'
import React from 'react'
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import AvatarComponent from '@/components/common/avatar';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface UserItemProps {
    item: any
    index: number
}


export default function UserItem(props: UserItemProps) {

    return (
        <div className='flex gap-8 flex-col lg:flex-row'>
            <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-5 items-center'>
                        <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                            <span className='material-symbols-rounded'>
                                drag_indicator
                            </span>
                        </div>
                        <h2 className='grow font-black text-xl text-red-400'>QUESTION {props.index + 1}</h2>
                    </div>
                    <p className='text-3xl font-black'>
                        {props.item.response?.response_score ? (props.item.point * props.item.response.response_score.final_score).toFixed(1) : '-'}
                        <span className='text-base text-red-400 ml-1'>/ {props.item.point}</span>
                    </p>
                </div>

                <div
                    className='rich-text-container bg-gray-100 px-5 py-3 rounded-xl'
                    dangerouslySetInnerHTML={{ __html: props.item.content }}
                />

                <div
                    className='rich-text-container'
                    dangerouslySetInnerHTML={{ __html: props.item.response?.content }}
                />
            </div>
            <div className='relative p-10 max-w-none lg:max-w-sm bg-white border-b-4 border-black rounded-2xl flex flex-col gap-2 z-10 overflow-hidden'>
                {
                    props.item.response?.response_score ?
                        (
                            <>
                                <Radar data={{
                                    labels: Object.keys(props.item.response.response_score.detail_score),
                                    datasets: [
                                        {
                                            label: 'Score',
                                            data: Object.values(props.item.response.response_score.detail_score),
                                            backgroundColor: '#FF7C7355',
                                            borderColor: '#FF7C73',
                                            pointBackgroundColor: '#FF7C73',
                                            borderWidth: 2,
                                        },
                                    ],
                                }} options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    },
                                    scales: {
                                        r: {
                                            min: 0,
                                            max: 1,
                                            ticks: {
                                                display: false,
                                            },
                                            pointLabels: {
                                                font: {
                                                    family: "'__Nunito_3dc409', '__Nunito_Fallback_3dc409', 'Nunito', sans-serif",
                                                    size: 10,
                                                },
                                                callback: function (value) {
                                                    return value.split(' ')
                                                },
                                            }
                                        }
                                    }
                                }} />

                                <table className="table-auto text-sm text-left mt-5">
                                    <thead>
                                        <tr className='bg-black text-white'>
                                            <th className='rounded-s-lg px-3 py-2'>Aspect</th>
                                            <th className='rounded-e-lg px-3 py-2'>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Object.keys(props.item.response.response_score.detail_score).map((item, index) => {
                                                return <tr key={item + index} className='even:bg-gray-100'>
                                                    <td className='rounded-s-lg px-3 py-2'>
                                                        {item}
                                                    </td>
                                                    <td className='rounded-e-lg px-3 py-2'>
                                                        {(props.item.response.response_score.detail_score[item] * 100).toFixed(1)}
                                                        %
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </>
                        )
                        : <p>No Response</p>
                }

            </div>
        </div >
    )
}
