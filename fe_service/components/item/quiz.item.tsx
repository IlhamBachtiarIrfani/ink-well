"use client"

import React from 'react'
import ButtonComponent from '../input/button'
import { useRouter } from 'next/navigation'
import { QuizEntity, QuizState } from '@/entities/quiz.entity'

interface QuizItemProps {
  item: QuizEntity
}


export default function QuizItem(props: QuizItemProps) {

  const actionDisplay = () => {
    switch (props.item.state) {
      case QuizState.ACTIVE:
        return <ActiveState id={props.item.id} />
      case QuizState.STARTED:
        return <OnGoingState id={props.item.id} />
      case QuizState.FINISHED:
        return <FinishState id={props.item.id} />
      case QuizState.DRAFT:
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
          router.push('quiz/' + props.id)
        }}
      />
    </div>
  )
}


interface ActiveStateProps {
  id: string
}

function ActiveState(props: ActiveStateProps) {
  const router = useRouter()
  return (
    <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-red-400 before:rotate-12 before:-z-10 z-10'>
      <ButtonComponent
        type={'DARK'}
        title='Open Exam'
        icon={<span className='material-symbols-rounded'>east</span>}
        onClick={() => {
          router.push('watch/' + props.id)
        }}
      />
    </div>
  )
}

interface OnGoingStateProps {
  id: string
}

function OnGoingState(props: OnGoingStateProps) {
  const router = useRouter()

  return (
    <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-black before:rotate-12 before:-z-10 z-10'>
      <ButtonComponent
        type={'LIGHT'}
        title='Supervise'
        icon={<span className='material-symbols-rounded'>domino_mask</span>}
        onClick={() => {
          router.push('watch/' + props.id)
        }}
      />
    </div>
  )
}

interface FinishStateProps {
  id: string
}

function FinishState(props: FinishStateProps) {
  const router = useRouter()
  return (
    <div className='relative flex items-center'>
      <ButtonComponent
        type={'DARK_OUTLINED'}
        title='See Result'
        icon={<span className='material-symbols-rounded'>query_stats</span>}
        onClick={() => {
          router.push('result/' + props.id)
        }}
      />
    </div>
  )
}