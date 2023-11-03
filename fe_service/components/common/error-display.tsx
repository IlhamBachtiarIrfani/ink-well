import React from 'react'

interface ErrorDisplayProps {
    errorData: string | string[] | null
    setErrorData: (value: string | string[] | null) => void
}

export default function ErrorDisplay(props: ErrorDisplayProps) {
    function onErrorClose(event: React.MouseEvent) {
        event.preventDefault();

        let newState: string | string[] | null = null;

        if (typeof props.errorData === 'string') {
            newState = null;
        } else if (Array.isArray(props.errorData)) {
            if (props.errorData.length > 2) {
                newState = props.errorData.slice(1);
            } else if (props.errorData.length === 2) {
                newState = props.errorData[1];
            }
        }

        props.setErrorData(newState);
    }

    return (
        <>
            {props.errorData !== null &&
                <div className='bg-white rounded-2xl text-black p-5 flex gap-3'>
                    <span className="material-symbols-rounded icon-bold text-red-400">
                        error
                    </span>
                    <div className='grow'>
                        <p className='font-black text-lg text-black leading-snug mb-1'>Error Message  {Array.isArray(props.errorData) && <span>({props.errorData.length})</span>}</p>
                        <p className='capitalize'>
                            {typeof props.errorData === 'string' && props.errorData}
                            {Array.isArray(props.errorData) && props.errorData[0]}
                        </p>
                    </div>
                    <span className="material-symbols-rounded" onClick={onErrorClose}>
                        close
                    </span>

                </div>
            }
        </>
    )
}
