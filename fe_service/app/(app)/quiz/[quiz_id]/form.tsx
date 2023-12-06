"use client"

import ErrorDisplay from '@/components/common/error-display'
import { useLayout } from '@/components/common/layout/base.layout'
import { useModal } from '@/components/common/modal'
import ButtonComponent from '@/components/input/button'
import NumberInputComponent from '@/components/input/number.input'
import ConfirmModal from '@/components/modal/confirm.modal'
import { QuizEntity } from '@/entities/quiz.entity'
import { UserData } from '@/entities/user.entity'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface QuizEditFormProps {
    data: QuizEntity
    userData: UserData
}

export default function QuizEditForm(props: QuizEditFormProps) {
    const router = useRouter()
    const modal = useModal()

    const layout = useLayout()
    useEffect(() => {
        layout.setHeaderActions(
            <>
                <ButtonComponent
                    title='Activate Quiz'
                    type='DARK'
                    icon={
                        <span className="material-symbols-rounded">
                            east
                        </span>
                    }
                    onClick={() => router.push("/watch/" + props.data.id)}
                />
            </>
        )

        return () => {
            layout.setHeaderActions(null)
        }
    }, [])


    const [inputTitle, setInputTitle] = useState(props.data.title)
    const [inputDesc, setInputDesc] = useState(props.data.desc)
    const [inputDuration, setInputDuration] = useState(props.data.duration_in_minutes)
    const [inputPassScore, setInputPassScore] = useState(props.data.pass_score * 100)

    const [isLoading, setLoading] = useState(false)
    const [errorData, setErrorData] = useState<any>(null)

    const isEdited = (
        inputTitle != props.data.title ||
        inputDesc != props.data.desc ||
        inputDuration != props.data.duration_in_minutes ||
        inputPassScore != props.data.pass_score
    )

    function onDeleteClick() {
        modal.showModal(<ConfirmModal
            title='Save edit change?'
            desc={`Are you sure to save change quiz ${props.data.id}?`}
            positiveLabel='Save Change'
            negativeLabel='Cancel'
            onPositive={onRequestEdit}
            onClose={modal.hideModal}
        />)
    }

    async function onRequestEdit() {
        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('title', inputTitle);
        formData.append('desc', inputDesc);
        formData.append('duration_in_minutes', inputDuration.toString());
        formData.append('pass_score', (inputPassScore / 100).toString());

        // Set the request options
        const requestOptions: RequestInit = {
            method: 'PATCH',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + props.userData.token
            },
        };

        setErrorData(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${props.data.id}`, requestOptions);

            const data = await response.json();

            if (!response.ok) {
                setErrorData(data.message);
            } else {
                await router.refresh()
            }

        } catch (error: any) {
            setErrorData("Internal Server Error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (isLoading) return;

        onDeleteClick()
    };

    function onTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()

        setInputTitle(event.target.value)
    }

    function onDescChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setInputDesc(event.target.value)
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
                    onChange={onTitleChange}
                />

                <input
                    className='focus:outline-none'
                    placeholder='Put your quiz description here...'
                    value={inputDesc}
                    onChange={onDescChange}
                />

                <div className='flex gap-5 mt-3 flex-col sm:flex-row'>
                    <NumberInputComponent
                        icon={<span className='material-symbols-rounded'>
                            avg_pace
                        </span>}
                        desc='Minutes'
                        min={1}
                        max={1000}
                        value={inputDuration}
                        onChange={setInputDuration}
                    />

                    <NumberInputComponent
                        icon={<span className='material-symbols-rounded'>
                            rewarded_ads
                        </span>}
                        desc='% Pass Score'
                        min={1}
                        max={100}
                        value={inputPassScore}
                        onChange={setInputPassScore}
                    />
                </div>

                {isLoading && <p>Loading...</p>}

                {isEdited && <div className='flex items-center justify-end gap-4 mt-4'>
                    <ButtonComponent
                        title='Save Change'
                        type='RED'
                        icon={
                            <span className="material-symbols-rounded">
                                east
                            </span>
                        }
                    />
                </div>}
            </form>
        </>
    )
}
