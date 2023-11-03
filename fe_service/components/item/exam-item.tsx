'use client'

import React from 'react'
import ButtonComponent from '../input/button'
import { ExamEntity, ExamState } from '@/entities/exam'
import { useRouter } from 'next/navigation'

interface ExamItemProps {
    item: ExamEntity
}

export default function ExamItem(props: ExamItemProps) {

    const actionDisplay = () => {
        switch (props.item.state) {
            case ExamState.ACTIVE:
                return <ActiveState />
            case ExamState.STARTED:
                return <OnGoingState />
            case ExamState.FINISHED:
                return <FinishState />
            case ExamState.DRAFT:
            default:
                return <DraftState id={props.item.id} />
        }
    }

    return (
        <div key={props.item.id} className='bg-white p-10 rounded-2xl border-b-4 border-b-black flex overflow-hidden'>
            <div className='grow flex flex-col gap-5'>
                <h1 className='text-3xl font-black'>
                    {props.item.title}
                </h1>
                <div className='flex gap-10 font-bold text-red-400'>
                    <div className='flex items-center gap-3'>
                        <span className='material-symbols-rounded'>
                            cast
                        </span>
                        <p>{props.item.state}</p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <span className='material-symbols-rounded'>
                            avg_pace
                        </span>
                        <p>{props.item.duration_in_minutes} MINUTES</p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <span className='material-symbols-rounded'>live_help</span>
                        <p>{props.item.question_count} QUESTIONS</p>
                    </div>
                </div>
            </div>

            {
                actionDisplay()
            }
        </div>
    )
}

interface DraftStateProps {
    id: string
}

function DraftState(props: DraftStateProps) {
    const router = useRouter()

    return (
        <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-cyan-300 before:rotate-12 before:-z-10 z-10'>
            <ButtonComponent
                type={'DARK'}
                title='Edit Draft'
                icon={<span className='material-symbols-rounded'>edit</span>}
                onClick={() => {
                    router.push('admin/exam/' + props.id)
                }}
            />
        </div>
    )
}

function ActiveState() {
    return (
        <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-cyan-300 before:rotate-12 before:-z-10 z-10'>
            <ButtonComponent
                type={'DARK'}
                title='Open Exam'
                icon={<span className='material-symbols-rounded'>east</span>}
            />
        </div>
    )
}

function OnGoingState() {
    return (
        <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-black before:rotate-12 before:-z-10 z-10'>
            <ButtonComponent
                type={'LIGHT'}
                title='Supervise'
                icon={<span className='material-symbols-rounded'>domino_mask</span>}
            />
        </div>
    )
}

function FinishState() {
    return (
        <div className='relative flex items-center'>
            <ButtonComponent
                type={'DARK_OUTLINED'}
                title='See Result'
                icon={<span className='material-symbols-rounded'>query_stats</span>}
            />
        </div>
    )
}