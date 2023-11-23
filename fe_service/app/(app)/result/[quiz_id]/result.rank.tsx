import Image from 'next/image'
import { faker } from '@faker-js/faker'
import React from 'react'

interface RankUserProps {
    className: string | HTMLStyleElement
    data: any
}

function RankUser(props: RankUserProps) {
    return (
        <div className={'w-32 flex flex-col items-center ' + props.className}>
            <div className='w-24 h-24 -m-4 -mb-2 select-none pointer-events-none group-hover:-rotate-12 group-hover:scale-110 transition-transform'>
                <Image
                    src={'/avatar/' + props.data.user.photo_url}
                    alt={`Avatar`}
                    width={172}
                    height={172}
                />
            </div>
            <p className='text-xl font-black h-6 overflow-clip mb-0.5 text-clip text-center'>{props.data.user.name}</p>
            <div className='flex items-center gap-1 text-red-400'>
                <span className='material-symbols-rounded text-xl'>
                    rewarded_ads
                </span>
                <p className='font-medium leading-none'>
                    {props.data.score.final_score.toFixed(1)}
                </p>
            </div>
        </div>
    )
}

interface ResultRankProps {
    data: any
    title: string
}

export default function ResultRank(props: ResultRankProps) {
    return (
        <div className='flex-1 relative p-10 pt-16 pb-0 bg-white border-b-4 border-black rounded-2xl flex flex-col items-center z-10 overflow-hidden'>
            <Image
                className="absolute top-0 bottom-0 w-auto h-full -z-10 left-0 -translate-x-3/4"
                src="/illustration.svg"
                alt="Ink Well Logo"
                width={604}
                height={453}
                priority
            />

            <Image
                className="absolute top-0 bottom-0 w-auto h-full -z-10 right-0 translate-x-3/4"
                src="/illustration.svg"
                alt="Ink Well Logo"
                width={604}
                height={453}
                priority
            />

            <h1 className='text-4xl font-black mb-20'>{props.title}</h1>

            <div className='flex gap-10 -mb-16'>
                <RankUser className='mt-10' data={props.data[1]} />
                <RankUser className='' data={props.data[0]} />
                <RankUser className='mt-16' data={props.data[2]} />
            </div>


            <Image src='/podium.svg' alt='podium' width={489} height={173} className='mt-4' />

        </div>
    )
}
