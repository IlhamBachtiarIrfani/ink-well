import { QuestionEntity } from "./question.entity";

export enum QuizState {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
}

export interface QuizEntity {
    id: string,
    title: string,
    desc: string,
    duration_in_minutes: number,
    pass_score: number,
    join_code: string | null,
    state: QuizState,
    question_count: number,
    question: QuestionEntity[]
    exam_access: ExamAccessEntity[]
}