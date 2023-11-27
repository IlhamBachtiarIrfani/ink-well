"use client"

import { QuestionEntity } from '@/entities/question.entity'
import React, { useState } from 'react'
import ButtonComponent from '../input/button'
import { useRouter } from 'next/navigation'
import { useModal } from '../common/modal'
import ConfirmModal from '../modal/confirm.modal'
import { UserData } from '@/entities/user.entity'
import ErrorDisplay from '../common/error-display'

interface QuestionAdminItemProps {
  item: QuestionEntity,
  userData: UserData
  index: number,
}

export default function QuestionAdminItem(props: QuestionAdminItemProps) {
  const router = useRouter()
  const modal = useModal()

  const [isLoading, setLoading] = useState(false)
  const [errorData, setErrorData] = useState<any>(null)

  function onEditClick() {
    router.push(`/quiz/${props.item.exam_id}/question/${props.item.id}`)
  }

  async function onRequestDelete() {
    if (isLoading) return;

    setLoading(true);

    // Set the request options
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + props.userData.token
      },
    };

    setErrorData(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${props.item.exam_id}/question/${props.item.id}`, requestOptions);

      const data = await response.json();

      if (!response.ok) {
        setErrorData(data.message);
      } else {
        router.refresh()
      }

    } catch (error: any) {
      setErrorData("Internal Server Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function onDeleteClick() {
    modal.showModal(<ConfirmModal
      title='Delete this Question?'
      desc={`Are you sure to delete question ${props.item.id}?`}
      positiveLabel='Delete'
      negativeLabel='Cancel'
      onPositive={onRequestDelete}
      onClose={modal.hideModal}
    />)
  }

  return (
    <div className='bg-white p-10 rounded-2xl border-b-4 border-black flex flex-col gap-5'>
      <div className='flex gap-5 items-center flex-wrap'>
        <div className='flex-none w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
          <span className='material-symbols-rounded'>
            drag_indicator
          </span>
        </div>
        <h2 className='grow font-black text-xl text-red-400 whitespace-nowrap'>QUESTION {props.index}</h2>

        <div className='flex gap-5'>
          <ButtonComponent
            type={'SMALL_DARK_OUTLINED'}
            title='Delete'
            icon={<span className='material-symbols-rounded  text-lg'>
              delete
            </span>}
            onClick={onDeleteClick}
          />
          <ButtonComponent
            type={'SMALL_DARK'}
            title='Edit'
            icon={<span className='material-symbols-rounded text-lg'>
              edit
            </span>}
            onClick={onEditClick}
          />
        </div>
      </div>

      <ErrorDisplay errorData={errorData} setErrorData={setErrorData} />

      {isLoading && <p>Loading...</p>}

      <div className='rich-text-container-large' dangerouslySetInnerHTML={{ __html: props.item.content }}>
      </div>

      <p className='font-black'>Answer Key :</p>

      <div className='rich-text-container' dangerouslySetInnerHTML={{ __html: props.item.answer_key }}>
      </div>

      <div className='flex items-start gap-3 flex-wrap mt-2'>
        <div className='bg-black text-white rounded-full pl-3 pr-5 h-8 flex  items-center gap-2 font-bold'>
          <span className='material-symbols-rounded'>
            new_releases
          </span>
          {props.item.point} Point
        </div>

        {props.item.keyword?.map((item) => {
          return <QuestionKeywordItem key={item} keyword={item} />
        })}
      </div>
    </div>
  )
}

interface QuestionKeywordItemProps {
  keyword: string
}

function QuestionKeywordItem(props: QuestionKeywordItemProps) {
  return <span className='bg-red-400 text-white rounded-full px-5 py-1 h-8 font-bold'>
    {props.keyword}
  </span>
}
