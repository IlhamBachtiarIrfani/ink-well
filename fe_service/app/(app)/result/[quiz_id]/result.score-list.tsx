"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

interface ScoreListProps {
    data: any
    exam_id: string
}

export default function ScoreList(props: ScoreListProps) {
    const router = useRouter()

    return (
        <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
            <h1 className='flex-1 text-5xl font-black'>Participant Analysis</h1>
            <p className='text-gray-500 max-w-3xl'>Shows the lowest and highest scores, the most common score (median), and how spread out the scores are. It’s like a scoreboard that gives you a quick overview of everyone’s performance.</p>

            <div className='w-full overflow-auto'>
                <table className="min-w-full table-auto">
                    <thead className='text-left bg-black text-white'>
                        <tr>
                            <th className='px-4 py-2 w-6/12 rounded-s-xl'>Name</th>
                            <th className='px-4 py-2'>Score</th>
                            <th className='px-4 py-2'>Status</th>
                            <th className='px-4 py-2 rounded-e-xl'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((item: any) => {
                                if (!item.score) return;

                                return (
                                    <tr key={item.exam_id + item.user_id} className='even:bg-gray-100'>
                                        <td className='px-4 py-2 rounded-s-xl whitespace-nowrap'>
                                            {item.user.name}
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <span className='font-black'>
                                                {item.score.final_score.toFixed(1)}
                                            </span>
                                            <span className='pl-2'>
                                                ({(item.score.score_percentage * 100).toFixed(1)}%)
                                            </span>
                                        </td>
                                        <td className='px-4 py-2'>
                                            {
                                                item.score.is_pass ?
                                                    (
                                                        <span className='bg-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-sm'>Passed</span>
                                                    )
                                                    :
                                                    (
                                                        <span className='bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm'>Failed</span>
                                                    )
                                            }
                                        </td>
                                        <td className='px-4 py-1 rounded-e-xl'>
                                            <button className='bg-black text-white px-3 py-1 flex rounded-full' onClick={() => router.push(`/result/${props.exam_id}/user/${item.user.id}`)}>
                                                <span className='material-symbols-rounded'>
                                                    troubleshoot
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
