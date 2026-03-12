import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDishEntity1767000000002 implements MigrationInterface {
  name = "AddDishEntity1767000000002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create dish table
    await queryRunner.query(`
      CREATE TABLE "dish" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying NOT NULL,
        "price" double precision NOT NULL DEFAULT 0,
        "restaurantId" uuid NOT NULL,
        CONSTRAINT "PK_dish" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "dish" ADD CONSTRAINT "FK_dish_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 2. Create dish_ingredient table
    await queryRunner.query(`
      CREATE TABLE "dish_ingredient" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "dishId" uuid,
        "ingredientId" uuid,
        CONSTRAINT "PK_dish_ingredient" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "dish_ingredient" ADD CONSTRAINT "FK_di_dish" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_ingredient" ADD CONSTRAINT "FK_di_ingredient" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 3. Migrate existing menu_item data into dish (use menu_item.id as dish.id for 1:1 mapping)
    await queryRunner.query(`
      INSERT INTO "dish" ("id", "name", "description", "price", "restaurantId")
      SELECT mi."id", mi."name", mi."description", mi."price", m."restaurantId"
      FROM "menu_item" mi
      JOIN "menu" m ON mi."menuId" = m."id"
    `);

    // 4. Migrate ingredient links
    await queryRunner.query(`
      INSERT INTO "dish_ingredient" ("id", "dishId", "ingredientId")
      SELECT "id", "itemId", "ingredientId"
      FROM "menu_item_ingredient"
    `);

    // 5. Add dishId and priceOverride columns to menu_item
    await queryRunner.query(
      `ALTER TABLE "menu_item" ADD COLUMN "dishId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" ADD COLUMN "priceOverride" double precision`,
    );

    // 6. Populate dishId (same ID since we used menu_item ID as dish ID)
    await queryRunner.query(`UPDATE "menu_item" SET "dishId" = "id"`);

    // 7. Set NOT NULL and FK
    await queryRunner.query(
      `ALTER TABLE "menu_item" ALTER COLUMN "dishId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" ADD CONSTRAINT "FK_menu_item_dish" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 8. Drop old columns from menu_item
    await queryRunner.query(`ALTER TABLE "menu_item" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "menu_item" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "menu_item" DROP COLUMN "price"`);

    // 9. Drop old junction table
    await queryRunner.query(
      `ALTER TABLE "menu_item_ingredient" DROP CONSTRAINT "FK_mii_ingredient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item_ingredient" DROP CONSTRAINT "FK_mii_item"`,
    );
    await queryRunner.query(`DROP TABLE "menu_item_ingredient"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Re-create menu_item_ingredient
    await queryRunner.query(`
      CREATE TABLE "menu_item_ingredient" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "itemId" uuid,
        "ingredientId" uuid,
        CONSTRAINT "PK_menu_item_ingredient" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "menu_item_ingredient" ADD CONSTRAINT "FK_mii_item" FOREIGN KEY ("itemId") REFERENCES "menu_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item_ingredient" ADD CONSTRAINT "FK_mii_ingredient" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 2. Re-add columns to menu_item
    await queryRunner.query(
      `ALTER TABLE "menu_item" ADD COLUMN "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" ADD COLUMN "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" ADD COLUMN "price" double precision`,
    );

    // 3. Restore data from dish
    await queryRunner.query(`
      UPDATE "menu_item" mi
      SET "name" = d."name", "description" = d."description", "price" = d."price"
      FROM "dish" d
      WHERE mi."dishId" = d."id"
    `);

    // 4. Set NOT NULL on restored columns
    await queryRunner.query(
      `ALTER TABLE "menu_item" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" ALTER COLUMN "price" SET NOT NULL`,
    );

    // 5. Restore ingredient links
    await queryRunner.query(`
      INSERT INTO "menu_item_ingredient" ("id", "itemId", "ingredientId")
      SELECT "id", "dishId", "ingredientId"
      FROM "dish_ingredient"
    `);

    // 6. Drop dish FK and columns from menu_item
    await queryRunner.query(
      `ALTER TABLE "menu_item" DROP CONSTRAINT "FK_menu_item_dish"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_item" DROP COLUMN "priceOverride"`,
    );
    await queryRunner.query(`ALTER TABLE "menu_item" DROP COLUMN "dishId"`);

    // 7. Drop dish_ingredient
    await queryRunner.query(
      `ALTER TABLE "dish_ingredient" DROP CONSTRAINT "FK_di_ingredient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_ingredient" DROP CONSTRAINT "FK_di_dish"`,
    );
    await queryRunner.query(`DROP TABLE "dish_ingredient"`);

    // 8. Drop dish
    await queryRunner.query(
      `ALTER TABLE "dish" DROP CONSTRAINT "FK_dish_restaurant"`,
    );
    await queryRunner.query(`DROP TABLE "dish"`);
  }
}
