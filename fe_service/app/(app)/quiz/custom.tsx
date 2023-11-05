"use client"

import { useLayout } from '@/components/common/layout/base.layout'
import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Custom() {
    const router = useRouter()
    const layout = useLayout()

    useEffect(() => {
        layout.setHeaderActions(
            <ButtonComponent
                title='Create Quiz'
                type='RED'
                icon={
                    <span className="material-symbols-rounded">
                        east
                    </span>
                }
                onClick={() => router.push("/quiz/create")}
            />
        )
        return () => {
            layout.setHeaderActions(null)
        }
    }, [])
    return (
        <></>
    )
}
