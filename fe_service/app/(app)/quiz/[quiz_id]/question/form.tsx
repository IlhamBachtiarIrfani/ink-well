"use client"

import TagInputComponent from '@/components/input/tag.input'
import React, { FormEvent, useState } from 'react'

import dynamic from 'next/dynamic';
import { QuizEntity } from '@/entities/quiz.entity';
import ButtonComponent from '@/components/input/button';
import { useRouter } from 'next/navigation';
import ErrorDisplay from '@/components/common/error-display';
import { UserData } from '@/entities/user.entity';
import NumberInputComponent from '@/components/input/number.input';
import BreadcrumbsComponent from '@/components/common/breadcrumbs';

const RichTextInputComponent = dynamic(
    () => import('@/components/input/richText.input'),
    { ssr: false }
);

interface QuestionCreateFormProps {
    quizData: QuizEntity,
    userData: UserData
}

export default function QuestionCreateForm(props: QuestionCreateFormProps) {
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)
    const [errorData, setErrorData] = useState<any>(null)

    const [questionContent, setQuestionContent] = useState("")
    const [answerKey, setAnswerKey] = useState("")
    const [tag, setTag] = useState<string[]>([])
    const [point, setPoint] = useState(1)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (isLoading) return;

        setLoading(true);


        const formData = new URLSearchParams();
        formData.append('content', questionContent);
        formData.append('answer_key', answerKey);
        formData.append('point', point.toString());

        tag.map((item) => {
            formData.append('keyword[]', item);
        })

        // Set the request options
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + props.userData.token
            },
        };

        setErrorData(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}exam/${props.quizData.id}/question`, requestOptions);

            const data = await response.json();

            if (!response.ok) {
                setErrorData(data.message);
            } else {
                await router.push('/quiz/' + props.quizData.id)
                router.refresh()
            }

        } catch (error: any) {
            setErrorData("Internal Server Error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className='container max-w-3xl mx-auto px-5 flex flex-col py-8 gap-8'
            onSubmit={onSubmit}
        >
            <BreadcrumbsComponent
                links={[
                    {
                        name: 'Home',
                        href: `${process.env.NEXT_PUBLIC_BASE_URL}`
                    },
                    {
                        name: 'Quiz',
                        href: `${process.env.NEXT_PUBLIC_BASE_URL}quiz`
                    },
                    {
                        name: 'Edit',
                    },
                    {
                        name: props.quizData.id,
                        href: `${process.env.NEXT_PUBLIC_BASE_URL}quiz/${props.quizData.id}`
                    },
                    {
                        name: 'Add Question',
                    },
                    
                ]}
            />

            <div className='bg-white px-10 py-6 rounded-2xl border-b-4 border-black'>
                <div className='flex gap-5 items-center'>
                    <div className='flex-none w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                        <span className='material-symbols-rounded'>
                            drag_indicator
                        </span>
                    </div>
                    <h2 className='grow font-black text-xl text-red-400 uppercase'>{props.quizData.title} (New Question)</h2>
                </div>
            </div>

            <ErrorDisplay errorData={errorData} setErrorData={setErrorData} />

            <div className='bg-white p-10 rounded-2xl border-b-4 border-black'>
                <h1 className='font-black'>Question Content</h1>
                <RichTextInputComponent
                    onInputChange={setQuestionContent}
                />

                <NumberInputComponent
                    icon={<span className='material-symbols-rounded'>
                        new_releases
                    </span>}
                    desc='Point'
                    min={1}
                    max={1000}
                    value={point}
                    onChange={setPoint}
                />
            </div>

            <div className='bg-white p-10 rounded-2xl border-b-4 border-black'>
                <h1 className='font-black'>Answer Key</h1>
                <RichTextInputComponent
                    onInputChange={setAnswerKey}
                />

                <TagInputComponent
                    placeholder='Add Keyword...'
                    value={tag}
                    onChange={setTag}
                />
            </div>

            {isLoading && <p>Loading...</p>}

            <div className='flex gap-3 flex-col-reverse sm:flex-row justify-end'>
                <ButtonComponent
                    title='Cancel'
                    type='DARK_OUTLINED'
                    onClick={() => router.back()}
                />
                <ButtonComponent
                    title='Add Question'
                    type='RED'
                    icon={<span className='material-symbols-rounded'>
                        east
                    </span>}
                />
            </div>
        </form>
    )
}
