import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIngredientCategory1768063473280 implements MigrationInterface {
    name = 'AddIngredientCategory1768063473280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredient_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_3c78593a0a0730edc15d9f198c6" UNIQUE ("name"), CONSTRAINT "PK_60428d3b6f6ef96b3f3ed32ae83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "ingredientCategoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_cd95894adb0cb0d15b0b8f9a562" FOREIGN KEY ("ingredientCategoryId") REFERENCES "ingredient_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_cd95894adb0cb0d15b0b8f9a562"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "ingredientCategoryId"`);
        await queryRunner.query(`DROP TABLE "ingredient_category"`);
    }

}
