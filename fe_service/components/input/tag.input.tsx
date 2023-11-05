"use client"
import React, { useEffect, useRef, useState } from 'react'

interface TagInputComponentProps {
    value?: string[],
    onChange?: (values: string[]) => void,
    placeholder: string,
}

export default function TagInputComponent(props: TagInputComponentProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState("")
    const [tagValue, setTagValue] = useState<string[]>(props.value ?? [])

    useEffect(() => {
        if (props.onChange) {
            props.onChange(tagValue)
        }
    }, [tagValue, props])


    function onComponentClick(event: React.MouseEvent) {
        event.preventDefault();

        inputRef.current?.focus();
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();

        const inputValue = event.target.value;
        const regex = /^[a-zA-Z ]*$/;

        if (regex.test(inputValue) || inputValue === '') {
            setInputValue(inputValue);
        }
    }

    function onRemoveTag(indexToRemove: number) {
        setTagValue((prevArray) => prevArray.filter((_, index) => index !== indexToRemove));
    };

    function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key == 'Enter') {
            event.preventDefault()

            setTagValue((oldValue) => [...oldValue, inputValue])
            setInputValue("")
        }
    }

    return (
        <div className='group text-black border border-black rounded-full flex items-center px-2 gap-1 cursor-text overflow-y-auto scroll-hide' onClick={onComponentClick}>
            {
                tagValue.map((item, index) => {
                    function onTagRemoveClick(event: React.MouseEvent) {
                        event.preventDefault()
                        onRemoveTag(index)
                    }

                    return <p key={item + index} className='whitespace-nowrap bg-red-400 text-white pl-4 pr-3 rounded-full flex items-center gap-1 cursor-default'>
                        {item}

                        <span
                            className='material-symbols-rounded text-lg cursor-pointer'
                            onClick={onTagRemoveClick}
                        >
                            close
                        </span>
                    </p>
                })
            }
            <input
                ref={inputRef}
                className='ml-3 min-w-[10rem] bg-transparent h-10 w-full focus:outline-none border-none '
                type='text'
                value={inputValue}
                onChange={onInputChange}
                placeholder={props.placeholder}
                onKeyDown={onInputKeyDown}
            />
        </div>
    )
}
