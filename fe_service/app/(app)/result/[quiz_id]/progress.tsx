"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

interface ProgressListProps {
    progress_percent: number
    progress_type: string
    progress_detail: string
}

interface ProgressProps {
    exam_id: string
}

export default function Progress(props: ProgressProps) {
    const router = useRouter()

    const [progressList, setProgressList] = useState<ProgressListProps[]>([])
    const [mainProgress, setMainProgress] = useState<ProgressListProps>({ progress_type: 'All', progress_detail: 'Preparing...', progress_percent: 0 })

    const [recentProgress, setRecentProgress] = useState<ProgressListProps>(mainProgress)

    const detailProgressContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const source = new EventSource(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}scoring/progress/` + props.exam_id);

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);

            const main_data: ProgressListProps = data.data

            setProgressList((old) => [main_data, ...old])

            setRecentProgress(main_data)

            if (main_data.progress_type == 'All') {
                setMainProgress(main_data)

                if (main_data.progress_percent >= 100) {
                    router.replace('/result/' + props.exam_id)
                }
            }
        }

        source.onerror = (event) => {
            source.close()
        }

        return () => {
            source.close()
        }
    }, [])

    const scrollToTop = () => {
        if (detailProgressContainer.current) {
            detailProgressContainer.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(scrollToTop, [progressList])



    return (
        <main className='container max-w-2xl px-5 mx-auto flex flex-col py-8 gap-8'>
            <h1>Progress</h1>
            <div className='bg-white p-10 rounded-xl flex flex-col gap-2 justify-center items-center border-b-4 border-black'>
                <p className='text-3xl font-black'>{mainProgress.progress_percent.toFixed(0)}%</p>
                <p className='text-center text-gray-500'>{mainProgress.progress_detail}</p>

                <div className='w-full h-6 relative bg-gray-100 border border-b-4 border-black rounded-full overflow-hidden'>
                    <div className='absolute inset-0 bg-red-400 transition-all duration-200' style={{ right: (100 - recentProgress.progress_percent) + '%' }} />
                </div>
            </div>
            <div
                className='flex flex-col gap-2 bg-white rounded-xl border-b-4 border-black p-10 overflow-auto max-h-80'
                ref={detailProgressContainer}>
                {
                    progressList.map((item, index) => {
                        return (
                            <div key={index} className='flex gap-3'>
                                <p className='font-black whitespace-nowrap w-12 flex-none text-right'>
                                    {item.progress_percent.toFixed(0)}%
                                </p>
                                <p className='text-gray-400 line-clamp-2'>
                                    <span className='pr-2 font-bold'>{item.progress_type}.</span>
                                    {item.progress_detail}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </main>
    )
}
