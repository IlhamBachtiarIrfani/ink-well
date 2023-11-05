"use server"

import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { getLoginCookies } from './action'
import HeaderComponent from '@/components/common/layout/header'
import FooterComponent from '@/components/common/layout/footer'
import BaseLayout from '@/components/common/layout/base.layout'

export default async function NotFoundPage() {
    const userData = await getLoginCookies()
    return (
        <BaseLayout userData={userData}>
            <main className='flex-1 flex flex-col justify-center items-center gap-4'>
                <h1 className='font-black text-red-400 text-9xl'>404</h1>
                <h1 className='font-black text-3xl'>Page Not Found</h1>
            </main>
        </BaseLayout>
    )
}
