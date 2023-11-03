"use server"

import { ReactElement } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getLoginCookies } from '@/app/action'

interface ProtectedPageProps {
    children: ReactElement | ReactElement[]
}

async function ProtectedPage(props: ProtectedPageProps) {
    const userData = await getLoginCookies()

    if (!userData) {
        redirect('/login')
    }

    return props.children
}

export default ProtectedPage;
