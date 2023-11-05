export interface QuestionEntity {
    id: string,
    exam_id: string,
    content: string,
    answer_key: string,
    point: number,
    keyword: string[],
}