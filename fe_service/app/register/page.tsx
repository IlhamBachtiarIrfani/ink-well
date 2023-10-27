import Image from 'next/image'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import PasswordInputComponent from '@/components/input/password-input'
import TextInputComponent from '@/components/input/text-input'
import React from 'react'

export default function RegisterPage() {
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

                <h1 className='text-4xl font-black'>Register</h1>
                <p className='mt-3'>Start your experience with our EdTech</p>

                <form className='mt-10 flex flex-col gap-5'>
                    <TextInputComponent
                        placeholder='Username'
                        icon={<span className="material-symbols-rounded">
                            account_circle
                        </span>}
                    />
                    <TextInputComponent
                        placeholder='Email'
                        icon={<span className="material-symbols-rounded">
                            alternate_email
                        </span>}
                    />
                    <PasswordInputComponent
                        placeholder='Password'
                        icon={<span className="material-symbols-rounded">
                            lock
                        </span>}
                    />

                    <div className='mt-5'>
                        <ButtonComponent
                            type={ButtonType.LIGHT}
                            title='Register'
                            icon={<span className="material-symbols-rounded">
                                east
                            </span>}
                        />
                    </div>
                </form>

                <p className='absolute left-0 right-0 bottom-5 font-bold text-center'>Already have account? <span className='text-cyan-300'>Login</span></p>
            </section>
        </main>
    )
}
