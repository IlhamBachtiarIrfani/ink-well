import { getLoginCookies } from '@/app/action'
import HeaderComponent from '@/components/common/header'
import ProtectedPage from '@/components/common/protected-page'
import React from 'react'
import CreateQuizForm from './form'

export default async function CreateQuizPage() {
    const userData = await getLoginCookies()

    return (
        <ProtectedPage>
            <HeaderComponent userData={userData}>
            </HeaderComponent>
            <main className='container max-w-3xl mx-auto px-5 flex flex-col py-8 gap-8'>
                <CreateQuizForm userData={userData!} />
            </main>
        </ProtectedPage>
    )
}
