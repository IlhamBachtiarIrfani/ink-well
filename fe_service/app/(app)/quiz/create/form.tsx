"use client"

import { clampNumber } from '@/app/helper'
import ErrorDisplay from '@/components/common/error-display'
import ButtonComponent from '@/components/input/button'
import { UserData } from '@/entities/user.entity'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'

interface CreateQuizFormProps {
    userData: UserData
}

export default function CreateQuizForm(props: CreateQuizFormProps) {
    const router = useRouter()

    const [inputTitle, setInputTitle] = useState("")
    const [inputDesc, setInputDesc] = useState("")
    const [inputDuration, setInputDuration] = useState(5)
    const [inputPassScore, setInputPassScore] = useState(75)

    const [isLoading, setLoading] = useState(false)
    const [errorData, setErrorData] = useState<any>(null)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (isLoading) return;

        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('title', inputTitle);
        formData.append('desc', inputDesc);
        formData.append('duration_in_minutes', inputDuration.toString());
        formData.append('pass_score', (inputPassScore / 100).toString());

        // Set the request options
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + props.userData?.token
            },
        };

        setErrorData(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam`, requestOptions);

            const data = await response.json();

            if (!response.ok) {
                setErrorData(data.message);
            } else {
                await router.push('/quiz');
                router.refresh();
            }

        } catch (error: any) {
            setErrorData("Internal Server Error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    function onInputTitleChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setInputTitle(event.target.value)
    }

    function onInputDescChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setInputDesc(event.target.value)
    }

    function onInputDurationChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const value = +event.target.value ?? 1;
        setInputDuration(clampNumber(value, 1, 9999))
    }

    function onInputPassScoreChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const value = +event.target.value ?? 1;
        setInputPassScore(clampNumber(value, 1, 100))
    }

    return (
        <>
            <ErrorDisplay errorData={errorData} setErrorData={setErrorData} />
            <form onSubmit={onSubmit} className='relative overflow-hidden bg-white p-10 rounded-2xl border-b-4 border-black flex flex-col gap-5'>
                <div className='absolute rotate-45 top-4 -right-16 w-52 h-10 bg-red-400' />


                <input
                    className='font-black text-3xl focus:outline-none mr-10'
                    placeholder='New Quiz #1'
                    value={inputTitle}
                    onChange={onInputTitleChange}
                />

                <input
                    className='focus:outline-none'
                    placeholder='Put your quiz description here...'
                    value={inputDesc}
                    onChange={onInputDescChange}
                />

                <div className='flex gap-5 flex-col sm:flex-row'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Quiz Duration</p>
                        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
                            <span className='material-symbols-rounded'>
                                avg_pace
                            </span>
                            <input
                                type='number'
                                min={1}
                                value={inputDuration}
                                onChange={onInputDurationChange}
                                className='w-full focus:outline-none h-10'
                            />
                            <p className='flex-none whitespace-nowrap'>
                                Minutes
                            </p>
                        </div>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Quiz Passing Score</p>
                        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
                            <span className='material-symbols-rounded'>
                                rewarded_ads
                            </span>
                            <input
                                type='number'
                                min={1}
                                max={100}
                                value={inputPassScore}
                                onChange={onInputPassScoreChange}
                                className='w-full focus:outline-none h-10'
                            />
                            <p className='flex-none whitespace-nowrap'>
                                %
                            </p>
                        </div>
                    </div>
                </div>


                {isLoading && <p>Loading...</p>}

                <div className='flex items-start sm:items-center  justify-end gap-4 mt-4 flex-col-reverse sm:flex-row'>
                    <ButtonComponent
                        title='Cancel'
                        type='DARK_OUTLINED'
                        onClick={() => {
                            router.back()
                        }}
                    />
                    <ButtonComponent
                        title='Create Quiz'
                        type='RED'
                        icon={
                            <span className="material-symbols-rounded">
                                east
                            </span>
                        }
                    />
                </div>
            </form>
        </>
    )
}
