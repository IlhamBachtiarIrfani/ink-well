"use client"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface JoinQuizClientProps {
    token: string,
    quiz_id: string,
}

export default function JoinQuizClient(props: JoinQuizClientProps) {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const socket = io(`ws://localhost:3000/participant`, {
            extraHeaders: {
                authorization: 'Bearer ' + props.token,
                quiz_id: props.quiz_id,
            }
        });

        setWebSocket(socket)

        socket.on('events', function (data) {
            console.log(data);
        })

        socket.on('exception', function (data) {
            console.error(data);
        })

        return () => {
            socket.close();
        }
    }, [])


    return (
        <div>JoinQuizClient</div>
    )
}
