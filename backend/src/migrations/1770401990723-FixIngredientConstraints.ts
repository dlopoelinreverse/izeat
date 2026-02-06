import { MigrationInterface, QueryRunner } from "typeorm";

export class FixIngredientConstraints1770401990723 implements MigrationInterface {
    name = 'FixIngredientConstraints1770401990723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f"`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "UQ_c62528984ad36e3879fa279e3ee" UNIQUE ("name", "restaurantId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "UQ_c62528984ad36e3879fa279e3ee"`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f" UNIQUE ("name")`);
    }

}
