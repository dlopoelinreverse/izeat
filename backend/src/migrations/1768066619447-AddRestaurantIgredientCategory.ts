import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRestaurantIgredientCategory1768066619447 implements MigrationInterface {
    name = 'AddRestaurantIgredientCategory1768066619447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_category" ADD "restaurantId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredient_category" ADD CONSTRAINT "FK_164d751b7a287199ea8391d8656" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_category" DROP CONSTRAINT "FK_164d751b7a287199ea8391d8656"`);
        await queryRunner.query(`ALTER TABLE "ingredient_category" DROP COLUMN "restaurantId"`);
    }

}
