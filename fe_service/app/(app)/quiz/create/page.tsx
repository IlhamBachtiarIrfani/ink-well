"use server"

import React from 'react'
import CreateQuizForm from './form'
import { getLoginCookies } from '@/app/action'

export default async function CreateQuizPage() {
    const userData = await getLoginCookies()

    return (
        <div className='container max-w-3xl px-5 mx-auto flex flex-col py-8 gap-8'>
            <CreateQuizForm userData={userData!} />
        </div>
    )
}
