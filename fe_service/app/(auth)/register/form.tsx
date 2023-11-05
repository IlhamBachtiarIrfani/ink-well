"use client"
import ErrorDisplay from '@/components/common/error-display'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import PasswordInputComponent from '@/components/input/password.input'
import TextInputComponent from '@/components/input/text-input'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setLoginCookies } from '../../action';

export default function RegisterForm() {
    const router = useRouter()

    const [inputName, setInputName] = useState("")
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")

    const [isLoading, setLoading] = useState(false)
    const [errorData, setErrorData] = useState<any>(null)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (isLoading) return;

        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('name', inputName);
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
                const expires_date = new Date(data.data.expires_in)

                const token = data.data.access_token
                const name = data.data.user.name
                const email = data.data.user.email
                const role = data.data.user.role
                const photo_url = data.data.user.photo_url

                setLoginCookies(token, expires_date, name, email, role, photo_url)

                if (window.history.state && window.history.state.idx > 0) {
                    router.back()
                } else {
                    router.push('/')
                }
            }

        } catch (error: any) {
            setErrorData("Internal Server Error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className='mt-10 flex flex-col gap-5' onSubmit={onSubmit}>

            <ErrorDisplay errorData={errorData} setErrorData={setErrorData} />

            <TextInputComponent
                placeholder='Username'
                icon={<span className="material-symbols-rounded">
                    account_circle
                </span>}
                value={inputName}
                onChange={setInputName}
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

            {isLoading && <p>Loading...</p>}

            <div className='mt-5'>
                <ButtonComponent
                    type='LIGHT'
                    title='Register'
                    icon={<span className="material-symbols-rounded">
                        east
                    </span>}
                />
            </div>
        </form>
    )
}
