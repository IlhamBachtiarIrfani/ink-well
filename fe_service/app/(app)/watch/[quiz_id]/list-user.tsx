'use client'
import React from 'react'
import Image from 'next/image'

interface ListUserQuizProps {
    data: ExamAccessEntity[]
}

export default function ListUserQuiz(props: ListUserQuizProps) {
    return (
        <div className='grid-profile gap-5'>
            {
                props.data.map((item) => {
                    return <UserItemView key={item.user_id} item={item} />
                })
            }
        </div>
    )
}

interface UserItemViewProps {
    item: ExamAccessEntity
}

interface StatusViewProps {
    iconName: string
    statusName: string
}

function StatusView(props: StatusViewProps) {
    return (
        <>
            <span className='material-symbols-rounded text-lg leading-tight'>{props.iconName}</span>
            <p className='text-xs leading-tight text-red-400'>{props.statusName}</p>
        </>
    )
}

function UserItemView(props: UserItemViewProps) {
    const isSuspected = false

    return <div className='group bg-white p-2 rounded-full border border-b-4 border-black flex items-center gap-4 hover:scale-105 transition-transform'>
        <div className='relative flex-none w-10 h-10'>
            <div className='w-16 h-16 -m-3 group-hover:-rotate-12 group-hover:scale-125 transition-transform'>
                <Image
                    className={'transition-all duration-500 ' + (props.item.socket_id ? 'saturate-100 brightness-100' : 'saturate-0 brightness-75')}
                    src={"/avatar/" + props.item.user.photo_url}
                    alt={`Avatar`}
                    width={172}
                    height={172}
                />
            </div>
            {isSuspected && <span className='absolute -right-1 -bottom-1 material-symbols-rounded icon-fill text-lg text-red-400 bg-white rounded-full leading-none '>error</span>}
        </div>
        <div>
            <p className={'font-black leading-tight line-clamp-1 capitalize'}>
                {props.item.user.name}
            </p>
            <div className='flex items-center gap-2'>
                {props.item.type == "ADMIN" && <span className="material-symbols-rounded text-lg leading-tight">
                    shield_person
                </span>}
                {
                    props.item.socket_id ?
                        <StatusView iconName='cast' statusName='Connected' />
                        :
                        <StatusView iconName='cast_warning' statusName='Disconnected' />
                }

            </div>
        </div>
    </div>
}