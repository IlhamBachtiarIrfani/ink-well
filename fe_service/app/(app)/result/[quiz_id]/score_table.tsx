"use client"

import React from 'react'
import { faker } from '@faker-js/faker';


interface ScoreTableProps {
    labels: string[]
}

export default function ScoreTable(props: ScoreTableProps) {
    return (
        <div className='flex-1  relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
            <table className="table-auto">
                <thead className='text-left'>
                    <tr className='bg-red-400 text-white'>
                        <th className='px-4 py-2 rounded-l-lg'>Name</th>
                        {
                            props.labels.map((item, index) => {
                                return (
                                    <th key={item + index} className='px-4 py-2'>
                                        {item}
                                    </th>
                                )
                            })
                        }
                        <th className='px-4 py-2 rounded-r-lg'>Final Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from({ length: 10 }).map((item, index) => {
                            return (
                                <tr key={index} className='hover:bg-slate-200 transition-colors'>
                                    <td className='px-4 py-2 rounded-l-lg'>
                                        {faker.person.fullName()}
                                    </td>
                                    {
                                        props.labels.map((item, i) => {
                                            return (
                                                <td key={index + item + i} className='px-4 py-2'>
                                                    {faker.number.float({ min: 0, max: 100 }).toFixed(2)}%
                                                </td>
                                            )
                                        })
                                    }

                                    <td className='px-4 py-2 rounded-r-lg'>
                                        {faker.number.float({ min: 0, max: 100 }).toFixed(2)}%
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>
    )
}
