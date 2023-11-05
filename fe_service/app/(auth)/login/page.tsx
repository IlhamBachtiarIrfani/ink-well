"use server"

import Image from 'next/image'
import React from 'react'
import LoginForm from './form'
import Link from 'next/link'
import { getLoginCookies } from '@/app/action'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
    const userData = await getLoginCookies()

    if (userData) {
        redirect('/')
    }
    return (
        <main className='bg-white h-screen w-screen overflow-hidden flex'>
            <section className='relative flex-grow flex items-center justify-center p-40'>
                {/* LOGO IMG */}
                <Image
                    className="absolute top-6 left-10"
                    src="/ink-well.svg"
                    alt="Ink Well Logo"
                    width={65}
                    height={40}
                    priority
                />

                {/* ILLUSTRATION IMG */}
                <Image
                    className="relative w-full h-full"
                    src="/illustration.svg"
                    alt="Ink Well Logo"
                    width={604}
                    height={453}
                    priority
                />

                <p className='absolute left-0 right-0 bottom-5 text-center'>Made with love @ilham_irfan</p>
            </section>

            {/* FROM SECTION  */}
            <section className='relative flex-none w-[32rem] bg-black text-white p-20 flex flex-col justify-center'>

                <div className='absolute rotate-45 top-4 -right-16 w-52 h-16 bg-red-400' />

                <h1 className='text-4xl font-black'>Login</h1>
                <p className='mt-3'>Start your experience with our EdTech</p>

                <LoginForm />

                <p className='absolute left-0 right-0 bottom-5 font-bold text-center'>Don&apos;t have account?
                    <Link href="/register" className='text-cyan-300 pl-1'>
                        Register
                    </Link>
                </p>
            </section>
        </main>
    )
}
