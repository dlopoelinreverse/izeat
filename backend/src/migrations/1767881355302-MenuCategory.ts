import { MigrationInterface, QueryRunner } from "typeorm";

export class MenuCategory1767881355302 implements MigrationInterface {
    name = 'MenuCategory1767881355302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_category" DROP CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc"`);
        await queryRunner.query(`ALTER TABLE "menu_category" ADD CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_category" DROP CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc"`);
        await queryRunner.query(`ALTER TABLE "menu_category" ADD CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
