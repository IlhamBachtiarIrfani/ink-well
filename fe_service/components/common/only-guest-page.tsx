"use server"

import { ReactElement } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getLoginCookies } from '@/app/action'

interface OnlyGuestPageProps {
    children: ReactElement | ReactElement[]
}

async function OnlyGuestPage(props: OnlyGuestPageProps) {
    const userData = await getLoginCookies()

    if (userData) {
        redirect('/')
    }

    return props.children;
}

export default OnlyGuestPage;
