export enum ExamState {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
}

export interface QuestionEntity {
    id: string,
    exam_id: string,
    content: string,
    answer_key: string,
    keyword: string[],
}

export interface ExamEntity {
    id: string,
    title: string,
    desc: string,
    duration_in_minutes: number,
    joinCode: string | null,
    state: ExamState,
    question_count: number,
    question: QuestionEntity[]
}