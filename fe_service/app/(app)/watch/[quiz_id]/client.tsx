"use client"
import { QuizEntity } from '@/entities/quiz.entity';
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import WaitingQuiz from './waiting';
import ListUserQuiz from './list-user';
import { UserData } from '@/entities/user.entity';

interface WatchQuizClientProps {
    token: string,
    quizData: QuizEntity,
    userData: UserData,
}

export default function WatchQuizClient(props: WatchQuizClientProps) {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    const [examAccessList, setExamAccessList] = useState<ExamAccessEntity[]>(props.quizData.exam_access)

    useEffect(() => {
        const socket = io(`ws://localhost:3000/admin`, {
            extraHeaders: {
                authorization: 'Bearer ' + props.token,
                quiz_id: props.quizData.id,
            }
        });

        setWebSocket(socket)

        socket.on('participant', function (data) {
            setExamAccessList(data)
        })

        socket.on('exception', function (data) {
            console.error(data);
        })

        return () => {
            socket.close();
        }
    }, [])


    return (
        <>
            <WaitingQuiz
                data={props.quizData}
                userCount={examAccessList.length ?? 0}
                userData={props.userData}
            />

            <ListUserQuiz data={examAccessList} />
        </>
    )
}
