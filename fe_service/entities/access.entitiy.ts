interface ExamAccessEntity {
    exam_id: string
    user_id: string
    type: string
    socket_id: string | null
    user: {
        id: string
        email: string
        name: string
        role: string
        photo_url: string
    }
}