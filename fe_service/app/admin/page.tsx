import HeaderComponent from '@/components/common/header'
import ProtectedPage from '@/components/common/protected-page'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import React from 'react'
import { getLoginCookies } from '../action'
import AdminCustomHeader from './admin-custom-header'
import { UserData } from '../const'
import { ExamEntity } from '@/entities/exam'
import ExamItem from '@/components/item/exam-item'

async function getData(userData: UserData) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + userData?.token
        },
    };

    const response = await fetch('http://localhost:3000/exam', requestOptions);
    const data = await response.json();

    if (!response.ok) {
        return [];
    }

    const examData: ExamEntity[] = data.data;
    return examData;
}

export default async function AdminPage() {
    const userData = await getLoginCookies()
    
    const data = await getData(userData!)

    return (
        <ProtectedPage>
            <HeaderComponent userData={userData} >
                <AdminCustomHeader />
            </HeaderComponent>
            <main className='container max-w-5xl px-5 mx-auto flex flex-col py-8 gap-8'>
                {
                    data.map((item) => {
                        return <ExamItem key={item.id} item={item} />
                    })
                }
            </main>
        </ProtectedPage>
    )
}