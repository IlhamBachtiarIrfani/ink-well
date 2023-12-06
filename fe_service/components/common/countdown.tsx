'use client'

import React, { useEffect, useState } from 'react'
import moment from 'moment'

interface CountdownComponentProps {
    finishTime: Date,
    isBig: boolean
}

export default function CountdownComponent(props: CountdownComponentProps) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (time > 0) {
            const timerId = setTimeout(() => {
                const startDate = moment(new Date());
                const timeEnd = moment(props.finishTime);
                const diff = timeEnd.diff(startDate);
                const diffDuration = moment.duration(diff);

                setTime(Math.floor(diffDuration.asSeconds()))
            }, 1000);
            return () => clearTimeout(timerId);
        } else {
            setTime(0)
        }
    }, [time]);

    useEffect(() => {
        const startDate = moment(new Date());
        const timeEnd = moment(props.finishTime);
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);

        setTime(Math.floor(diffDuration.asSeconds()))
    }, [props.finishTime])


    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div className={!props.isBig ? 'flex items-center justify-center gap-3  py-3 px-3 lg:py-4 lg:px-5 bg-gray-100 rounded-2xl' : 'bg-cyan-300 rounded-2xl px-8 py-5 font-black text-7xl tracking-wider flex gap-5 items-center'}>
            <span className={'material-symbols-rounded icon-bold ' + (!props.isBig ? 'text-5xl' : 'text-5xl sm:text-6xl md:text-7xl')}>
                avg_pace
            </span>
            <p className={'font-black ' + (!props.isBig ? 'text-5xl' : 'text-5xl sm:text-6xl md:text-7xl')}>
                {minutes.toString().padStart(2, '0')}
                :
                {seconds.toString().padStart(2, '0')}
            </p>
        </div>
    )
}
