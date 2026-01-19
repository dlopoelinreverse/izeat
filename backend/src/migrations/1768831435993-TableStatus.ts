import { MigrationInterface, QueryRunner } from "typeorm";

export class TableStatus1768831435993 implements MigrationInterface {
    name = 'TableStatus1768831435993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_table" DROP CONSTRAINT "FK_263f26ff823cdb9cac2ae508ab6"`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ALTER COLUMN "status" SET DEFAULT 'available'`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ALTER COLUMN "restaurantId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ADD CONSTRAINT "FK_263f26ff823cdb9cac2ae508ab6" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_table" DROP CONSTRAINT "FK_263f26ff823cdb9cac2ae508ab6"`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ALTER COLUMN "restaurantId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurant_table" ADD CONSTRAINT "FK_263f26ff823cdb9cac2ae508ab6" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
