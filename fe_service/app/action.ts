'use server'

import { cookies } from 'next/headers'
import { UserData, UserRole } from './const';

export async function setLoginCookies(token: string, expires_in: Date, name: string, email: string, role: string) {
    cookies().set('token', token, { expires: expires_in });
    cookies().set('name', name, { expires: expires_in });
    cookies().set('email', email, { expires: expires_in });
    cookies().set('role', role, { expires: expires_in });
}

export async function getLoginCookies() {
    const token = cookies().get('token')?.value
    const name = cookies().get('name')?.value
    const email = cookies().get('email')?.value
    const role = cookies().get('role')?.value

    if (!token || !name || !email || !role) return null;

    const userData: UserData = {
        token: token,
        name: name,
        email: email,
        role: UserRole[role as keyof typeof UserRole],
    }

    return userData;
}

export async function deleteLoginCookies() {
    cookies().delete('token')
    cookies().delete('name')
    cookies().delete('email')
    cookies().delete('role')
}