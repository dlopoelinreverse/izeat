import { MigrationInterface, QueryRunner } from "typeorm";

export class MenuMenutItemOndelete1768834942996 implements MigrationInterface {
    name = 'MenuMenutItemOndelete1768834942996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_item" DROP CONSTRAINT "FK_a686871e76438259418aa5faceb"`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" DROP CONSTRAINT "UQ_76b80ec7fe237c78e65989022c6"`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ADD CONSTRAINT "UQ_464da99497cee20c4747b748b3c" UNIQUE ("capacity")`);
        await queryRunner.query(`ALTER TABLE "menu_item" ADD CONSTRAINT "FK_a686871e76438259418aa5faceb" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_item" DROP CONSTRAINT "FK_a686871e76438259418aa5faceb"`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" DROP CONSTRAINT "UQ_464da99497cee20c4747b748b3c"`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ADD CONSTRAINT "UQ_76b80ec7fe237c78e65989022c6" UNIQUE ("number")`);
        await queryRunner.query(`ALTER TABLE "menu_item" ADD CONSTRAINT "FK_a686871e76438259418aa5faceb" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
