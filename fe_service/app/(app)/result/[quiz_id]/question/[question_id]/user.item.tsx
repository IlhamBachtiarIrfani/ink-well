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
}


export default function UserItem(props: UserItemProps) {

    return (
        <div className='flex gap-8'>
            <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
                <div className='flex justify-between items-center'>
                    <AvatarComponent photo_url={'/avatar/' + props.item.user.photo_url} name={props.item.user.name} />
                    <p className='text-3xl font-black'>
                        {(props.item.response_score.final_score * 100).toFixed(1)}
                        <span className='text-base text-red-400 ml-1'>%</span>
                    </p>
                </div>

                <div
                    className='rich-text-container'
                    dangerouslySetInnerHTML={{ __html: props.item.content }}
                />
            </div>
            <div className='relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-2 z-10 overflow-hidden'>
                <Radar data={{
                    labels: Object.keys(props.item.response_score.detail_score),
                    datasets: [
                        {
                            label: 'Score',
                            data: Object.values(props.item.response_score.detail_score),
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

                <table className="table-auto text-sm text-left border border-gray-300 ">
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 px-3 py-1'>Aspect</th>
                            <th className='border border-gray-300 px-3 py-1'>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(props.item.response_score.detail_score).map((item, index) => {
                                return <tr key={item + index}>
                                    <td className='border border-gray-300 px-3 py-1'>
                                        {item}
                                    </td>
                                    <td className='border border-gray-300 px-3 py-1'>
                                        {(props.item.response_score.detail_score[item] * 100).toFixed(1)}
                                        %
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
