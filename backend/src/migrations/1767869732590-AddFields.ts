import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFields1767869732590 implements MigrationInterface {
    name = 'AddFields1767869732590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "restaurantId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_item" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "menu_item" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_67303879c5cc3143bd3c012ade7" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item" ADD CONSTRAINT "FK_4af7d3076242d526641d4443d79" FOREIGN KEY ("categoryId") REFERENCES "menu_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_item" DROP CONSTRAINT "FK_4af7d3076242d526641d4443d79"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_67303879c5cc3143bd3c012ade7"`);
        await queryRunner.query(`ALTER TABLE "menu_item" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "menu_item" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "restaurantId"`);
    }

}
