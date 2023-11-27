"use client"

import Image from 'next/image'
import ButtonComponent from '../../input/button'

import AvatarComponent from '../avatar'
import { usePathname, useRouter } from 'next/navigation'
import { UserData } from '@/entities/user.entity'
import { deleteLoginCookies } from '@/app/action'
import Link from 'next/link'
import { useState } from 'react'
import { useLayout } from './base.layout'


interface HeaderComponentProps {
    userData: UserData | null,
    actions?: React.ReactNode
}


export default function HeaderComponent(props: HeaderComponentProps) {
    const router = useRouter()
    const layout = useLayout()

    const [avatarDropdownShow, setAvatarDropdownShow] = useState(false)

    function onRequestLogout(event: React.MouseEvent) {
        event.preventDefault()
        deleteLoginCookies()
        layout.setHeaderActions(null);
    }

    function onLogoClick(event: React.MouseEvent) {
        event.preventDefault()
        router.push("/")
    }

    function onLoginClick() {
        router.push("/login")
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

                <div className='flex items-center gap-5'>
                    {props.actions}

                    {
                        props.userData ? (
                            <div className='relative'>
                                <div onClick={() => setAvatarDropdownShow(value => !value)} className='group flex gap-5 items-center cursor-pointer select-none bg-gray-100 rounded-full p-1 hover:scale-105 transition-transform'>
                                    <div className='w-10 h-10 rounded-full'>
                                        <div className='w-16 h-16 -m-3 select-none pointer-events-none group-hover:-rotate-12 group-hover:scale-110 transition-transform'>
                                            <Image
                                                src={"/avatar/" + props.userData.photo_url}
                                                alt={`Avatar ${props.userData.name}`}
                                                width={172}
                                                height={172}
                                            />
                                        </div>
                                    </div>
                                    <p className='hidden md:block font-black text-lg capitalize whitespace-nowrap pr-7'>{props.userData.name}</p>
                                </div>
                                {
                                    avatarDropdownShow && <div className='absolute mt-2 w-32 md:w-auto md:left-0 right-0 bg-white border border-b-4 p-5 rounded-2xl flex flex-col gap-3'>
                                        <Link href='/profile'>Profile</Link>
                                        <button onClick={onRequestLogout} className='focus:outline-none text-left text-red-400'>Logout</button>
                                    </div>
                                }

                            </div>
                        ) : (
                            <ButtonComponent
                                type='DARK_OUTLINED'
                                title='Try For Free'
                                onClick={onLoginClick}
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