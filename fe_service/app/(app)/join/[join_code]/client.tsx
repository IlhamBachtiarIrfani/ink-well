"use client"
import React, { useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import QuizWaitingStateView from './waiting';
import QuizStartedStateView from './started';
import LoadingView from './loading';
import { QuestionEntity } from '@/entities/question.entity';
import { QuizEntity } from '@/entities/quiz.entity';
import QuizFinishedStateView from './finished';
import { QuizClientState } from '@/app/helper';
import { useRouter } from 'next/navigation';

interface JoinQuizClientProps {
    token: string,
    quizData: QuizEntity,
}

export default function JoinQuizClient(props: JoinQuizClientProps) {
    const router = useRouter()
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    const [quizState, setQuizState] = useState(QuizClientState.LOADING)
    const [questionList, setQuestionList] = useState<QuestionEntity[]>([])

    const [finishTime, setFinishTime] = useState(new Date())

    const sendAction = useCallback((action: string, detail: any) => {
        if (webSocket) {
            webSocket.emit('sendAction', {
                "action": action,
                "detail": detail
            });
        }
    }, [webSocket]);

    const handleFocus = useCallback(() => {
        console.log('Window focused!');
        sendAction('FOCUSED', null);
    }, [sendAction]);

    const handleBlur = useCallback(() => {
        console.log('Window blurred!');
        sendAction('BLURRED', null);
    }, [sendAction]);

    const handleCopy = useCallback((event: ClipboardEvent) => {
        console.log('copy!');
        const copiedText = window?.getSelection()?.toString();
        sendAction('ON_COPY', { text: copiedText });
    }, [sendAction]);

    const handlePaste = useCallback((event: ClipboardEvent) => {
        console.log('paste!');
        const pastedText = event?.clipboardData?.getData('text');
        sendAction('ON_PASTE', { text: pastedText });
    }, [sendAction]);


    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_BASE_URL}participant?token=${props.token}&quiz_id=${props.quizData.id}`);

        setWebSocket(socket)

        socket.on('events', function (socketData) {
            const { type, data } = socketData

            switch (type) {
                case QuizClientState.WAITING:
                    setQuizState(QuizClientState.WAITING)
                    break;
                case QuizClientState.STARTED:
                    setQuizState(QuizClientState.STARTED)
                    setFinishTime(data.finish_time)
                    break;
                case QuizClientState.FINISHED:
                    router.replace("/history")
                    setQuizState(QuizClientState.FINISHED)
                    break;
                default:
                    setQuizState(QuizClientState.ERROR)
                    break;
            }
        })

        socket.on('question', function (data) {
            setQuestionList(data)
        })

        socket.on('exception', function (data) {
            console.error(data);
        })

        return () => {
            socket.close();
        };
    }, [])

    useEffect(() => {
        // Remove previous event listeners before adding new ones
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);

        // Add new event listeners
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        // Clean up event listeners when component unmounts
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, [handleFocus, handleBlur]);

    useEffect(() => {
        // Remove previous event listeners before adding new ones
        window.removeEventListener('copy', handleCopy);
        window.removeEventListener('paste', handlePaste);

        // Add new event listeners
        window.addEventListener('copy', handleCopy);
        window.addEventListener('paste', handlePaste);

        // Clean up event listeners when component unmounts
        return () => {
            window.removeEventListener('copy', handleCopy);
            window.removeEventListener('paste', handlePaste);
        };
    }, [handleCopy, handlePaste]);

    function onResponseChange(question_id: string, response: string) {
        if (!webSocket) return;
        const index = getQuestionIndexById(question_id);

        webSocket.emit('sendResponse', {
            "question_id": question_id,
            "index": index,
            "response": response
        })
    }

    function getQuestionIndexById(question_id: string) {
        return questionList.findIndex((item) => item.id === question_id) + 1;
    }

    function onChangeQuestion(question_id: string) {
        const index = getQuestionIndexById(question_id);
        sendAction('CHANGE_QUESTION', {
            "question_id": question_id,
            "index": index
        })
    }

    function onStopTyping(response: string, question_id: string) {
        if (!webSocket) return;
        const index = getQuestionIndexById(question_id);

        sendAction('STOP_TYPING', {
            "question_id": question_id,
            "index": index,
            "response": response
        })
    }

    function onStartTyping(question_id: string) {
        if (!webSocket) return;
        const index = getQuestionIndexById(question_id);

        sendAction('START_TYPING', {
            "question_id": question_id,
            "index": index,
        })
    }

    switch (quizState) {
        case QuizClientState.LOADING:
            return <LoadingView />
        case QuizClientState.WAITING:
            return <QuizWaitingStateView />
        case QuizClientState.STARTED:
            return <QuizStartedStateView
                finishTime={finishTime}
                questionData={questionList}
                onResponseChange={onResponseChange}
                onStartTyping={onStartTyping}
                onStopTyping={onStopTyping}
                onChangeQuestion={onChangeQuestion}
            />
        case QuizClientState.FINISHED:
            return <QuizFinishedStateView />
        default:
            return <p>Error {quizState}</p>
    }
}
