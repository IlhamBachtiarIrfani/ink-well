'use client'
import { useLayout } from '@/components/common/layout/base.layout'
import ButtonComponent from '@/components/input/button'
import { UserData } from '@/entities/user.entity'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Image from 'next/image'

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
                        <>
                            <ButtonComponent
                                title='History'
                                type='DARK_OUTLINED'
                                onClick={() => router.push("/history")}
                            />
                            <ButtonComponent
                                title='Join Quiz'
                                type='DARK'
                                onClick={() => router.push("/join")}
                            />
                        </>
                    )
                }
            </>)
        }
    }, [])

    const newLocal = ""
    return (
        <main className=''>
            <section className='grow container max-w-7xl px-5 mx-auto flex flex-col-reverse lg:flex-row items-center py-5 lg:py-16 gap-8'>
                <div className='w-full lg:w-5/12'>
                    <p className='font-black text-cyan-300'>START YOUR EXPERIENCE WITH</p>

                    <Image src="/line.svg" width={194} height={5} alt='line' className='-mt-1' />

                    <h1 className='text-6xl lg:text-7xl font-black mt-3'>Best <span className='text-red-400'>Essay</span> Scoring Platform</h1>
                    <p className='max-w-sm pr-5 my-7 text-gray-600'>Experience the future of education technology with easier way to scoring essay quiz</p>
                    <ButtonComponent title='Create Your Own Quiz' type='DARK' icon={<span className='material-symbols-rounded'>east</span>} />
                </div>
                <div className='w-full lg:w-7/12 flex items-center justify-center'>
                    <Image
                        className={newLocal}
                        src="/illustration.svg"
                        alt="Ink Well Logo"
                        width={604}
                        height={453}
                        priority
                    />
                </div>
            </section>
            <section className='w-full overflow-hidden pb-10'>
                <div className='bg-gray-200 -rotate-2 mt-10'>
                    <div className='grow container max-w-7xl px-5 mx-auto flex flex-col md:flex-row items-center py-10 gap-8'>
                        <div className='flex-1 text-xl font-black flex gap-5 items-center'>
                            <span className='material-symbols-rounded text-5xl icon-bold'>avg_pace</span>
                            <h3>Just a Minute for<br />Essay Scoring</h3>
                        </div>
                        <div className='flex-1 text-xl font-black flex gap-5 items-center'>
                            <span className='material-symbols-rounded text-5xl icon-bold'>troubleshoot</span>
                            <h3>Deep Analytics<br />Essay Scoring</h3>
                        </div>
                        <div className='flex-1 text-xl font-black flex gap-5 items-center'>
                            <span className='material-symbols-rounded text-5xl icon-bold'>translate</span>
                            <h3>English & Indonesia<br />Language Support</h3>
                        </div>
                    </div>
                </div>
            </section>
            <section className='grow container max-w-7xl px-5 mx-auto flex flex-col lg:flex-row items-center py-16 gap-8 mt-10'>
                <div className='w-full lg:w-6/12 flex items-center justify-center lg:justify-start pb-20 lg:pb-10 pl-5'>
                    <Image src="/girl.png" alt='boy' width={512} height={512} className='w-56 h-80 bg-gray-400 rounded-2xl shadow-custom shadow-red-400 -rotate-12 overflow-hidden object-cover translate-y-10' />
                    <Image src="/boy.png" alt='boy' width={512} height={512} className='w-56 h-80 bg-gray-400 rounded-2xl shadow-custom shadow-cyan-300 rotate-3 overflow-hidden object-cover' />
                </div>
                <div className='w-full lg:w-6/12'>
                    <p className='font-black text-red-400'>DISCOVER THE FUTURE OF EDUCATION EFFICIENCY</p>
                    <h2 className='text-5xl font-black mt-2'>Improve your education level productivity</h2>
                    <p className='mt-5 text-gray-600'>Boost Your Education Productivity with Our AI Essay Scoring App!</p>
                    <ul className='marker:text-red-400 list-outside list-disc ml-6 text-gray-600 mt-3 flex flex-col gap-2'>
                        <li>Rapid Grading: Assess essays in seconds, freeing up your time.</li>
                        <li>Fair Evaluation: Ensure consistent grading with unbiased AI scoring.</li>
                        <li>Detailed Feedback: Provide personalized insights for student improvement.</li>
                        <li>Time-Saving Analytics: Track progress effortlessly with our intuitive dashboard.</li>
                    </ul>
                </div>
            </section>
        </main>
    )
}
