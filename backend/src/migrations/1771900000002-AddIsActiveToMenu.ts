import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToMenu1771900000002 implements MigrationInterface {
    name = 'AddIsActiveToMenu1771900000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN IF EXISTS "isActive"`);
    }
}
