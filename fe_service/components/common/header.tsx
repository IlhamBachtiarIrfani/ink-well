"use client"

import Image from 'next/image'
import ButtonComponent, { ButtonType } from '../input/button'
import { UserData } from '@/app/const'
import { deleteLoginCookies } from '@/app/action'
import AvatarComponent from './avatar'
import { useRouter } from 'next/navigation'
import { ReactElement } from 'react'

interface HeaderComponentProps {
    userData?: UserData | null
    children?: ReactElement | ReactElement[]
}

export default function HeaderComponent(props: HeaderComponentProps) {
    const router = useRouter()

    function onRequestLogout() {
        deleteLoginCookies()
    }

    function onLogoClick(event: React.MouseEvent) {
        event.preventDefault()
        router.push("/")
    }

    return (
        <header className='sticky top-0 left-0 right-0 z-50 bg-white border-b-4'>
            <div className='container max-w-7xl mx-auto py-5 px-5 flex justify-between items-center'>
                <div
                    onClick={onLogoClick}
                    className='cursor-pointer'
                >
                    <Image
                        className="relative -mt-1 select-none"
                        src="/ink-well.svg"
                        alt="Ink Well Logo"
                        width={65}
                        height={40}
                        priority
                    />
                </div>

                <div className='flex items-center gap-6'>
                    {props.children}

                    {
                        props.userData ? (
                            <AvatarComponent
                                name={props.userData.name}
                                photo_url="/avatar/avatar-deer.svg"
                                onClick={onRequestLogout}
                            />
                        ) : (
                            <ButtonComponent
                                type='DARK_OUTLINED'
                                title='Try For Free'
                                onClick={() => {
                                    router.push("/login")
                                }}
                                icon={
                                    <span className="material-symbols-rounded">
                                        east
                                    </span>
                                }
                            />
                        )
                    }
                </div>
            </div>
        </header >
    )
}
