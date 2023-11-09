'use client'

import React, { useEffect, useState } from 'react'

interface CountdownComponentProps {
    remainingTime: number,
    isBig: boolean
}

export default function CountdownComponent(props: CountdownComponentProps) {
    const [time, setTime] = useState(props.remainingTime);

    useEffect(() => {
        if (time > 0) {
            const timerId = setTimeout(() => setTime(time - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [time]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div className={!props.isBig ? 'flex items-center justify-center gap-3 bg-gray-100 py-4 px-5 rounded-2xl' : 'bg-cyan-300 rounded-2xl px-8 py-5 font-black text-7xl tracking-wider flex gap-5 items-center'}>
            <span className={'material-symbols-rounded icon-bold ' + (!props.isBig ? 'text-5xl' : 'text-7xl')}>
                avg_pace
            </span>
            <p className={'font-black ' + (!props.isBig ? 'text-5xl' : 'text-7xl')}>
                {minutes.toString().padStart(2, '0')}
                :
                {seconds.toString().padStart(2, '0')}
            </p>
        </div>
    )
}
