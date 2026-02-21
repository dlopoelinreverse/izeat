import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQrCodeToTable1771900000001 implements MigrationInterface {
    name = 'AddQrCodeToTable1771900000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_table" ADD COLUMN IF NOT EXISTS "qrCode" TEXT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_table" DROP COLUMN IF EXISTS "qrCode"`);
    }
}
