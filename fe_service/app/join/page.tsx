import Image from 'next/image'
import React from 'react'
import HeaderComponent from '@/components/common/header'
import FooterComponent from '@/components/common/footer'
import ProtectedPage from '../../components/common/protected-page'
import JoinForm from './form'
import { getLoginCookies } from '../action'

export default async function JoinPage() {
    const userData = await getLoginCookies()
    return (
        <ProtectedPage>
            <div className='min-h-screen flex flex-col justify-between'>
                <HeaderComponent userData={userData} />
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

                        <JoinForm />
                    </div>
                </main>
                <FooterComponent />
            </div>
        </ProtectedPage>
    )
}
