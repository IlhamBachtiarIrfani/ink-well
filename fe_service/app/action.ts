'use server'

import { UserData, UserRole } from '@/entities/user.entity';
import { cookies } from 'next/headers'

export async function setLoginCookies(token: string, expires_in: Date, name: string, email: string, role: string, photo_url: string) {
    cookies().set('token', token, { expires: expires_in });
    cookies().set('name', name, { expires: expires_in });
    cookies().set('email', email, { expires: expires_in });
    cookies().set('role', role, { expires: expires_in });
    cookies().set('photo_url', photo_url, { expires: expires_in });
}

export async function getLoginCookies() {
    const token = cookies().get('token')?.value
    const name = cookies().get('name')?.value
    const email = cookies().get('email')?.value
    const role = cookies().get('role')?.value
    const photo_url = cookies().get('photo_url')?.value

    if (!token || !name || !email || !role || !photo_url) return null;

    const userData: UserData = {
        token: token,
        name: name,
        email: email,
        role: UserRole[role as keyof typeof UserRole],
        photo_url: photo_url
    }

    return userData;
}

export async function deleteLoginCookies() {
    cookies().delete('token')
    cookies().delete('name')
    cookies().delete('email')
    cookies().delete('role')
}