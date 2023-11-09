"use client"
import { QuizEntity } from '@/entities/quiz.entity';
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import WaitingQuiz from './waiting';
import ListUserQuiz from './list-user';
import { UserData } from '@/entities/user.entity';
import ProcessQuiz from './process';
import { QuizClientState } from '@/app/helper';

interface WatchQuizClientProps {
    token: string,
    quizData: QuizEntity,
    userData: UserData,
}

export default function WatchQuizClient(props: WatchQuizClientProps) {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    const [quizState, setQuizState] = useState(QuizClientState.LOADING)
    const [examAccessList, setExamAccessList] = useState<ExamAccessEntity[]>(props.quizData.exam_access)
    
    const [remainingTime, setRemainingTime] = useState(0)

    useEffect(() => {
        const socket = io(`ws://localhost:3000/admin`, {
            extraHeaders: {
                authorization: 'Bearer ' + props.token,
                quiz_id: props.quizData.id,
            }
        });

        setWebSocket(socket)

        socket.on('events', function (socketData) {
            console.log(socketData);

            const { type, data } = socketData

            switch (type) {
                case QuizClientState.WAITING:
                    setQuizState(QuizClientState.WAITING)
                    break;
                case QuizClientState.STARTED:
                    setQuizState(QuizClientState.STARTED)
                    setRemainingTime(data.remaining_time)
                    break;
                case QuizClientState.FINISHED:
                    setQuizState(QuizClientState.FINISHED)
                    break;
                default:
                    setQuizState(QuizClientState.ERROR)
                    break;
            }
        })

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

    function startQuiz() {
        console.log(webSocket);
        if (!webSocket) return;

        webSocket.emit('startExam', null)
    }

    switch (quizState) {
        case QuizClientState.LOADING:
            return <p>Loading...</p>
        case QuizClientState.WAITING:
            return <>
                <WaitingQuiz
                    data={props.quizData}
                    userCount={examAccessList.length ?? 0}
                    userData={props.userData}
                    startQuiz={startQuiz}
                />

                <ListUserQuiz data={examAccessList} />
            </>
        case QuizClientState.STARTED:
            return <>
                <ProcessQuiz
                    data={props.quizData}
                    userCount={examAccessList.length ?? 0}
                    userData={props.userData}
                    startQuiz={startQuiz}
                    remainingTime={remainingTime}
                />

                <ListUserQuiz data={examAccessList} />
            </>
        case QuizClientState.FINISHED:
            return <p>Finished</p>
        default:
            return <p>Error {quizState}</p>
    }
}
