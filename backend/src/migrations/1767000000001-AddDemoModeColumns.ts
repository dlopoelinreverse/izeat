import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDemoModeColumns1767000000001 implements MigrationInterface {
  name = "AddDemoModeColumns1767000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "isDemo" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_category" ADD COLUMN "order" integer NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu_category" DROP COLUMN "order"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDemo"`);
  }
}
