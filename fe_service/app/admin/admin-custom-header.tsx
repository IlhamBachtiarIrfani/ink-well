"use client"
import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'

export default function AdminCustomHeader() {
    const router = useRouter()

    function onClickCreateQuiz() {
        router.push("/admin/create")
    }

    return (
        <ButtonComponent
            title='Create Quiz'
            type='RED'
            icon={
                <span className="material-symbols-rounded">
                    east
                </span>
            }
            onClick={onClickCreateQuiz}
        />
    )
}
