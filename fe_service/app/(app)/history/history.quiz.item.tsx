"use client"

import ButtonComponent from "@/components/input/button";
import Moment from 'moment';
import { useRouter } from "next/navigation";

Moment.locale('id');

interface QuizItemProps {
    item: any;
}

export default function HistoryQuizItem(props: QuizItemProps) {
    const router = useRouter()

    return (
        <div className='bg-white p-10 rounded-2xl border-b-4 border-b-black flex flex-col sm:flex-row overflow-hidden gap-5 sm:gap-14'>
            <div className='grow flex flex-col gap-5'>
                <h1 className='text-3xl font-black'>
                    {props.item.exam.title}
                </h1>
                <div className='flex gap-10 font-bold text-red-400 flex-wrap gap-y-3'>
                    <div className='flex items-center gap-3'>
                        <span className='material-symbols-rounded'>
                            schedule
                        </span>
                        <p>{Moment(props.item.exam.started_at).add(props.item.exam.duration_in_minutes, 'minutes').format('HH:mm - d MMM YYYY')}</p>
                    </div>

                    {props.item.score && <div className='flex items-center gap-3'>
                        <span className='material-symbols-rounded'>
                            verified
                        </span>
                        <p>{props.item.score.is_pass ? 'PASSED' : 'FAILED'}</p>
                    </div>}


                    {props.item.score && <div className='flex items-center gap-3'>
                        <span className='material-symbols-rounded'>
                            trophy
                        </span>
                        <p>{(props.item.score.score_percentage * 100).toFixed(1)}%</p>
                    </div>
                    }
                </div>
            </div>
            {props.item.score &&
                <div className='relative flex items-center'>
                    <ButtonComponent
                        type={'DARK_OUTLINED'}
                        title='See Result'
                        icon={<span className='material-symbols-rounded'>query_stats</span>}
                        onClick={() => {
                            router.push('/history/' + props.item.exam.id)
                        }}
                    />
                </div>
            }
        </div>
    )
}