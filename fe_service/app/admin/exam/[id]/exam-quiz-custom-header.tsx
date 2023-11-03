"use client"
import ButtonComponent from '@/components/input/button'
import { useRouter } from 'next/navigation'

export default function ExamQuizCustomHeader() {
    const router = useRouter()

    function onClickCreateQuiz() {
        router.push("/admin/watch")
    }

    return (
        <ButtonComponent
            title='Share Quiz'
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
