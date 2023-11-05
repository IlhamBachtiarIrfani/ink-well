'use client'
import { useLayout } from '@/components/common/layout/base.layout'
import ButtonComponent from '@/components/input/button'
import { UserData } from '@/entities/user.entity'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

interface HomeComponentProps {
    userData: UserData | null
}

export default function HomeComponent(props: HomeComponentProps) {
    const router = useRouter()
    const layout = useLayout()

    useEffect(() => {
        if (props.userData) {
            layout.setHeaderActions(<>
                {
                    props.userData.role == 'ADMIN' ? (
                        <ButtonComponent
                            title='My Quiz'
                            type='DARK'
                            onClick={() => router.push("/quiz")}
                        />
                    ) : (
                        <ButtonComponent
                            title='Join Quiz'
                            type='DARK'
                            onClick={() => router.push("/join")}
                        />
                    )
                }
            </>)
        }
    }, [])

    return (
        <main className='grow container max-w-7xl px-5 mx-auto flex flex-col py-8 gap-8'>
            Home Page
        </main>
    )
}
