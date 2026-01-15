import { MigrationInterface, QueryRunner } from "typeorm";

export class IngredientsNameUnique1768489157599 implements MigrationInterface {
    name = 'IngredientsNameUnique1768489157599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f"`);
    }

}
