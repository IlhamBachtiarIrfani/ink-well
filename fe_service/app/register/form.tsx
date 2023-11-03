"use client"

import ErrorDisplay from '@/components/common/error-display'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import PasswordInputComponent from '@/components/input/password-input'
import TextInputComponent from '@/components/input/text-input'
import React, { useState } from 'react'

export default function RegisterForm() {
    const [inputUsername, setInputUsername] = useState("")
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")

    const [isLoading, setLoading] = useState(false)
    const [responseData, setResponseData] = useState<any>(null)
    const [errorData, setErrorData] = useState<string | string[] | null>(null)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (isLoading) return;

        setErrorData(null);

        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('name', inputUsername);
        formData.append('email', inputEmail);
        formData.append('password', inputPassword);

        // Set the request options
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        setErrorData(null);

        try {
            const response = await fetch('api/user/register', requestOptions);

            const data = await response.json();

            if (!response.ok) {
                setErrorData(data.message);
            } else {
                setResponseData(data)
            }

        } catch (error) {
            setErrorData("Internal Server Error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className='mt-10 flex flex-col gap-5' onSubmit={onSubmit}>

            <p>Data : {JSON.stringify(responseData)}</p>

            <ErrorDisplay errorData={errorData} setErrorData={setErrorData} />

            <TextInputComponent
                placeholder='Username'
                icon={<span className="material-symbols-rounded">
                    account_circle
                </span>}
                value={inputUsername}
                onChange={setInputUsername}
            />
            <TextInputComponent
                placeholder='Email'
                icon={<span className="material-symbols-rounded">
                    alternate_email
                </span>}
                value={inputEmail}
                onChange={setInputEmail}
            />
            <PasswordInputComponent
                placeholder='Password'
                icon={<span className="material-symbols-rounded">
                    lock
                </span>}
                value={inputPassword}
                onChange={setInputPassword}
            />

            <div className='mt-5'>
                <ButtonComponent
                    type={'LIGHT'}
                    title='Register'
                    icon={<span className="material-symbols-rounded">
                        east
                    </span>}
                />
            </div>
        </form>
    )
}
