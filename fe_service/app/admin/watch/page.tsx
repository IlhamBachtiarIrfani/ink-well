import Image from 'next/image'
import HeaderComponent from '@/components/common/header'
import React from 'react'
import FooterComponent from '@/components/common/footer'
import { getLoginCookies } from '@/app/action'

export default async function WatchQuizPage() {
    const userData = await getLoginCookies()

    return (
        <div>
            <HeaderComponent userData={userData} />
            <main className='container max-w-5xl px-5 mx-auto flex flex-col py-8 gap-8'>
                <div className='relative py-24 px-20 bg-white border-b-4 border-black rounded-2xl flex flex-col items-center gap-10 z-10 overflow-hidden'>

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

                    <h1 className='font-black text-3xl text-center'>Tech Titans: The Silicon Valley Saga</h1>

                    <div>
                        <div className='bg-cyan-300 rounded-2xl px-8 py-5 font-black text-7xl flex gap-5 items-center'>
                            <span className='material-symbols-rounded text-7xl icon-bold'>encrypted</span>
                            <p>G8Q4FA79</p>
                        </div>

                        <p className='text-center mt-5'>inkwell.com/join/G8Q4FA79</p>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='flex items-center gap-3 bg-black text-white h-10 pl-5 pr-8 py-2 rounded-full whitespace-nowrap'>
                            <span className='material-symbols-rounded'>avg_pace</span>
                            <p>90 Minutes</p>
                        </div>

                        <div className='flex items-center gap-3 bg-black text-white h-10 pl-5 pr-8 py-2 rounded-full whitespace-nowrap'>
                            <span className='material-symbols-rounded'>live_help</span>
                            <p>2 Question</p>
                        </div>

                        <div className='flex items-center gap-3 bg-black text-white h-10 pl-5 pr-8 py-2 rounded-full whitespace-nowrap'>
                            <span className='material-symbols-rounded'>groups</span>
                            <p>7 Participant</p>
                        </div>
                    </div>
                </div>

                <div className='grid-profile gap-5'>
                    {
                        [0, 1, 2, 3, 4, 5, 6].map((item) => {
                            return <div key={item} className='bg-white p-2 rounded-full border border-b-4 border-black flex items-center gap-3'>
                                <div className='relative flex-none w-10 h-10'>
                                    <div className='w-16 h-16 -m-3'>
                                        <Image
                                            src="/avatar/avatar-deer.svg"
                                            alt={`Avatar`}
                                            width={172}
                                            height={172}
                                        />
                                    </div>
                                    <span className='absolute -right-1 -bottom-1 material-symbols-rounded icon-fill text-lg text-red-400 bg-white rounded-full leading-none '>error</span>
                                </div>
                                <div>
                                    <p className='font-black leading-tight line-clamp-1'>Ronald Richards</p>
                                    <div className='flex items-center gap-2'>
                                        <span className='material-symbols-rounded text-lg leading-tight'>cast</span>
                                        <p className='text-xs leading-tight'>Connected</p>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </main>
            <FooterComponent />
        </div>
    )
}
