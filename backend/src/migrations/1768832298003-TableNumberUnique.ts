import { MigrationInterface, QueryRunner } from "typeorm";

export class TableNumberUnique1768832298003 implements MigrationInterface {
    name = 'TableNumberUnique1768832298003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_table" ADD CONSTRAINT "UQ_76b80ec7fe237c78e65989022c6" UNIQUE ("number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_table" DROP CONSTRAINT "UQ_76b80ec7fe237c78e65989022c6"`);
    }

}
