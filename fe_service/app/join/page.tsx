import Image from 'next/image'
import HeaderComponent from '@/components/common/header'
import React from 'react'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import FooterComponent from '@/components/common/footer'

export default function JoinPage() {
    return (
        <div className='min-h-screen flex flex-col justify-between'>
            <HeaderComponent />
            <main className='container max-w-3xl px-5 mx-auto'>
                <div className='relative py-24 px-20 bg-white border-b-4 border-black rounded-2xl flex flex-col items-center gap-8 z-10 overflow-hidden'>

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

                    <h1 className='font-black text-7xl'>Join Exam</h1>

                    <div className='border border-black flex gap-3 items-center h-10 rounded-full pl-3'>
                        <span className='material-symbols-rounded leading-none'>encrypted</span>
                        <input type='text' placeholder='XXXXXX' className='bg-transparent focus:outline-none w-32' />

                        <ButtonComponent 
                            type={ButtonType.DARK}
                            title='Join Quiz'
                            icon={<span className='material-symbols-rounded'>east</span>}
                        />
                    </div>
                </div>
            </main>
            <FooterComponent />
        </div>

    )
}
