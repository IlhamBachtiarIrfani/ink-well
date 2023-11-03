import { QuestionEntity } from '@/entities/exam'
import React from 'react'
import ButtonComponent from '../input/button'

interface QuestionItemProps {
    item: QuestionEntity,
    index: number,
}

export default function QuestionItem(props: QuestionItemProps) {
    return (
        <div className='bg-white p-10 rounded-2xl border-b-4 border-black flex flex-col gap-5'>
            <div className='flex gap-3 items-center'>
                <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                    <span className='material-symbols-rounded'>
                        drag_indicator
                    </span>
                </div>
                <h2 className='grow font-black text-xl text-red-400'>QUESTION {props.index}</h2>

                <ButtonComponent
                    type={'SMALL_DARK_OUTLINED'}
                    title='Delete'
                    icon={<span className='material-symbols-rounded  text-lg'>
                        delete
                    </span>}
                />
                <ButtonComponent
                    type={'SMALL_DARK'}
                    title='Edit'
                    icon={<span className='material-symbols-rounded text-lg'>
                        edit
                    </span>}
                />
            </div>

            <div className='text-lg'>
                {props.item.content}
            </div>

            <p className='font-black'>Answer Key :</p>

            <div>
                {props.item.answer_key}
            </div>

            <div className='flex items-start gap-3 flex-wrap'>
                <div className='bg-black text-white rounded-full pl-3 pr-5 h-8 flex  items-center gap-2 font-bold'>
                    <span className='material-symbols-rounded'>
                        new_releases
                    </span>
                    40 Point
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