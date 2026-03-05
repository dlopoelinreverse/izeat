import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1767000000000 implements MigrationInterface {
  name = "InitialSchema1767000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" text NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "image" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "session" (
        "id" text NOT NULL,
        "userId" text NOT NULL,
        "token" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "ipAddress" text,
        "userAgent" text,
        CONSTRAINT "UQ_session_token" UNIQUE ("token"),
        CONSTRAINT "PK_session" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "account" (
        "id" text NOT NULL,
        "accountId" text NOT NULL,
        "providerId" text NOT NULL,
        "userId" text NOT NULL,
        "accessToken" text,
        "refreshToken" text,
        "idToken" text,
        "accessTokenExpiresAt" TIMESTAMP,
        "refreshTokenExpiresAt" TIMESTAMP,
        "scope" text,
        "password" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_account" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "restaurant" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "ownerId" text NOT NULL,
        CONSTRAINT "PK_restaurant" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "menu" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "restaurantId" uuid NOT NULL,
        "isActive" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_menu" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "menu_category" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "menuId" uuid,
        CONSTRAINT "PK_menu_category" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "menu_item" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "menuId" uuid NOT NULL,
        "description" character varying NOT NULL,
        "price" double precision NOT NULL,
        "categoryId" uuid NOT NULL,
        CONSTRAINT "PK_menu_item" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ingredient_category" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "restaurantId" uuid NOT NULL,
        CONSTRAINT "PK_ingredient_category" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ingredient" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "available" boolean NOT NULL DEFAULT true,
        "ingredientCategoryId" uuid NOT NULL,
        "restaurantId" uuid NOT NULL,
        CONSTRAINT "UQ_c62528984ad36e3879fa279e3ee" UNIQUE ("name", "restaurantId"),
        CONSTRAINT "PK_ingredient" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "menu_item_ingredient" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "itemId" uuid,
        "ingredientId" uuid,
        CONSTRAINT "PK_menu_item_ingredient" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "restaurant_table" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "number" integer NOT NULL,
        "capacity" integer NOT NULL,
        "status" text NOT NULL DEFAULT 'available',
        "restaurantId" uuid NOT NULL,
        "qrCode" text,
        CONSTRAINT "PK_restaurant_table" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "subscription" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" text NOT NULL,
        "stripeCustomerId" text NOT NULL,
        "stripeSubscriptionId" text,
        "status" text NOT NULL DEFAULT 'incomplete',
        "currentPeriodEnd" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_subscription_userId" UNIQUE ("userId"),
        CONSTRAINT "PK_subscription" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "order" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "restaurantId" uuid NOT NULL,
        "tableId" uuid NOT NULL,
        "status" text NOT NULL DEFAULT 'pending',
        "type" character varying NOT NULL DEFAULT 'food',
        "items" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order" PRIMARY KEY ("id")
      )
    `);

    // Foreign keys
    await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_account_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_restaurant_owner" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_menu_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu_category" ADD CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu_item" ADD CONSTRAINT "FK_a686871e76438259418aa5faceb" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu_item" ADD CONSTRAINT "FK_4af7d3076242d526641d4443d79" FOREIGN KEY ("categoryId") REFERENCES "menu_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "ingredient_category" ADD CONSTRAINT "FK_164d751b7a287199ea8391d8656" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_cd95894adb0cb0d15b0b8f9a562" FOREIGN KEY ("ingredientCategoryId") REFERENCES "ingredient_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_67303879c5cc3143bd3c012ade7" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu_item_ingredient" ADD CONSTRAINT "FK_mii_item" FOREIGN KEY ("itemId") REFERENCES "menu_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu_item_ingredient" ADD CONSTRAINT "FK_mii_ingredient" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "restaurant_table" ADD CONSTRAINT "FK_263f26ff823cdb9cac2ae508ab6" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_subscription_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_order_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_order_table" FOREIGN KEY ("tableId") REFERENCES "restaurant_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_order_table"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_order_restaurant"`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_subscription_user"`);
    await queryRunner.query(`ALTER TABLE "restaurant_table" DROP CONSTRAINT "FK_263f26ff823cdb9cac2ae508ab6"`);
    await queryRunner.query(`ALTER TABLE "menu_item_ingredient" DROP CONSTRAINT "FK_mii_ingredient"`);
    await queryRunner.query(`ALTER TABLE "menu_item_ingredient" DROP CONSTRAINT "FK_mii_item"`);
    await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_67303879c5cc3143bd3c012ade7"`);
    await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_cd95894adb0cb0d15b0b8f9a562"`);
    await queryRunner.query(`ALTER TABLE "ingredient_category" DROP CONSTRAINT "FK_164d751b7a287199ea8391d8656"`);
    await queryRunner.query(`ALTER TABLE "menu_item" DROP CONSTRAINT "FK_4af7d3076242d526641d4443d79"`);
    await queryRunner.query(`ALTER TABLE "menu_item" DROP CONSTRAINT "FK_a686871e76438259418aa5faceb"`);
    await queryRunner.query(`ALTER TABLE "menu_category" DROP CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc"`);
    await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_menu_restaurant"`);
    await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_restaurant_owner"`);
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_account_user"`);
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP TABLE "restaurant_table"`);
    await queryRunner.query(`DROP TABLE "menu_item_ingredient"`);
    await queryRunner.query(`DROP TABLE "ingredient"`);
    await queryRunner.query(`DROP TABLE "ingredient_category"`);
    await queryRunner.query(`DROP TABLE "menu_item"`);
    await queryRunner.query(`DROP TABLE "menu_category"`);
    await queryRunner.query(`DROP TABLE "menu"`);
    await queryRunner.query(`DROP TABLE "restaurant"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
