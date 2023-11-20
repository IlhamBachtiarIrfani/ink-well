"use client"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import QuizWaitingStateView from './waiting';
import QuizStartedStateView from './started';
import LoadingView from './loading';
import { QuestionEntity } from '@/entities/question.entity';
import { QuizEntity } from '@/entities/quiz.entity';
import QuizFinishedStateView from './finished';
import { QuizClientState } from '@/app/helper';

interface JoinQuizClientProps {
    token: string,
    quidData: QuizEntity,
}

export default function JoinQuizClient(props: JoinQuizClientProps) {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    const [quizState, setQuizState] = useState(QuizClientState.LOADING)
    const [questionList, setQuestionList] = useState<QuestionEntity[]>([])

    const [remainingTime, setRemainingTime] = useState(0)

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_BASE_URL}participant`, {
            extraHeaders: {
                authorization: 'Bearer ' + props.token,
                quiz_id: props.quidData.id,
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

        socket.on('question', function (data) {
            console.log(data);
            setQuestionList(data)
        })

        socket.on('exception', function (data) {
            console.error(data);
        })

        return () => {
            socket.close();
        }
    }, [])

    function onResponseChange(question_id: string, response: string) {
        if (!webSocket) return;

        webSocket.emit('sendResponse', {
            "question_id": question_id,
            "response": response
        })
    }

    function onStopTyping(response: string, question_id: string) {
        if (!webSocket) return;
    }

    function onStartTyping(question_id: string) {
        if (!webSocket) return;
    }

    switch (quizState) {
        case QuizClientState.LOADING:
            return <LoadingView />
        case QuizClientState.WAITING:
            return <QuizWaitingStateView />
        case QuizClientState.STARTED:
            return <QuizStartedStateView
                remainingTime={remainingTime}
                questionData={questionList}
                onResponseChange={onResponseChange}
                onStartTyping={onStartTyping}
                onStopTyping={onStopTyping}
            />
        case QuizClientState.FINISHED:
            return <QuizFinishedStateView />
        default:
            return <p>Error {quizState}</p>
    }
}
