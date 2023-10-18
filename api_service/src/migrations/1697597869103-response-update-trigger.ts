import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResponseUpdateTrigger1697597869103 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE DEFINER='root'@'%' TRIGGER OnResponseUpdate
            BEFORE UPDATE
            ON response FOR EACH ROW
            INSERT INTO essay_scoring.response_history
            (id, user_id, question_id, content)
            values
            (uuid(), old.user_id, old.question_id, old.content)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER OnResponseUpdate
        `);
    }
}
