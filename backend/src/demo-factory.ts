import QRCode from "qrcode";
import Restaurant from "./entities/restaurant.entity";
import Menu from "./entities/menu.entity";
import MenuCategory from "./entities/menu-category.entity";
import MenuItem from "./entities/menu-item.entity";
import MenuItemIngredient from "./entities/menu-item-ingredient";
import Ingredient from "./entities/ingredient.entity";
import IngredientCategory from "./entities/ingredient-category";
import RestaurantTable from "./entities/restaurant-table.entity";
import Subscription from "./entities/subscription.entity";
import { Order } from "./entities/order.entity";
import User from "./entities/user.entity";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

export async function createDemoData(userId: string, restaurantName: string) {
  const user = await User.findOneOrFail({ where: { id: userId } });
  user.isDemo = true;
  await user.save();

  // --- Subscription trialing (bypass SubscriptionGuard) ---
  const sub = Subscription.create({
    userId,
    stripeCustomerId: `demo_${userId}`,
    stripeSubscriptionId: null,
    status: "trialing",
    currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  await sub.save();

  // --- Restaurant ---
  const restaurant = Restaurant.create({
    name: restaurantName,
    ownerId: userId,
  });
  await restaurant.save();

  // --- Ingredient categories ---
  const [catViandes, catLegumes, catLaitier, catEpices] = await Promise.all([
    IngredientCategory.create({ name: "Viandes", restaurantId: restaurant.id }).save(),
    IngredientCategory.create({ name: "Légumes", restaurantId: restaurant.id }).save(),
    IngredientCategory.create({ name: "Produits laitiers", restaurantId: restaurant.id }).save(),
    IngredientCategory.create({ name: "Épices & herbes", restaurantId: restaurant.id }).save(),
  ]);

  // --- Ingredients ---
  const [
    boeuf, poulet, saumon,
    tomate, salade, oignon, champignon, poivron,
    fromage, creme, beurre,
    poivre, thym, basilic,
  ] = await Promise.all([
    Ingredient.create({ name: "Boeuf haché", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
    Ingredient.create({ name: "Poulet", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
    Ingredient.create({ name: "Saumon", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
    Ingredient.create({ name: "Tomate", restaurantId: restaurant.id, ingredientCategoryId: catLegumes.id }).save(),
    Ingredient.create({ name: "Salade verte", restaurantId: restaurant.id, ingredientCategoryId: catLegumes.id }).save(),
    Ingredient.create({ name: "Oignon", restaurantId: restaurant.id, ingredientCategoryId: catLegumes.id }).save(),
    Ingredient.create({ name: "Champignons", restaurantId: restaurant.id, ingredientCategoryId: catLegumes.id }).save(),
    Ingredient.create({ name: "Poivron rouge", restaurantId: restaurant.id, ingredientCategoryId: catLegumes.id }).save(),
    Ingredient.create({ name: "Fromage râpé", restaurantId: restaurant.id, ingredientCategoryId: catLaitier.id }).save(),
    Ingredient.create({ name: "Crème fraîche", restaurantId: restaurant.id, ingredientCategoryId: catLaitier.id }).save(),
    Ingredient.create({ name: "Beurre", restaurantId: restaurant.id, ingredientCategoryId: catLaitier.id }).save(),
    Ingredient.create({ name: "Poivre noir", restaurantId: restaurant.id, ingredientCategoryId: catEpices.id }).save(),
    Ingredient.create({ name: "Thym", restaurantId: restaurant.id, ingredientCategoryId: catEpices.id }).save(),
    Ingredient.create({ name: "Basilic frais", restaurantId: restaurant.id, ingredientCategoryId: catEpices.id }).save(),
  ]);

  // --- Main menu (active) ---
  const menu = Menu.create({
    name: "Carte du " + restaurantName,
    restaurantId: restaurant.id,
    isActive: true,
  });
  await menu.save();

  // --- Menu categories ---
  const [catEntrees, catPlats, catDesserts, catBoissons] = await Promise.all([
    MenuCategory.create({ name: "Entrées", menu, order: 0 }).save(),
    MenuCategory.create({ name: "Plats", menu, order: 1 }).save(),
    MenuCategory.create({ name: "Desserts", menu, order: 2 }).save(),
    MenuCategory.create({ name: "Boissons", menu, order: 3 }).save(),
  ]);

  // Helper to create menu item + ingredients
  const createItem = async (
    name: string,
    description: string,
    price: number,
    category: MenuCategory,
    ingredients: Ingredient[],
  ) => {
    const item = await MenuItem.create({
      name,
      description,
      price,
      menuId: menu.id,
      categoryId: category.id,
    }).save();
    if (ingredients.length > 0) {
      await MenuItemIngredient.save(
        ingredients.map((ing) => MenuItemIngredient.create({ item, ingredient: ing })),
      );
    }
    return item;
  };

  // --- Dishes ---
  const [cesare, soupe] = await Promise.all([
    createItem("Salade César", "Poulet grillé, parmesan, croûtons maison", 10.5, catEntrees, [salade, poulet, fromage]),
    createItem("Soupe à l'oignon", "Bouillon, oignons caramélisés, gruyère fondu", 9.0, catEntrees, [oignon, fromage, beurre]),
    createItem("Champignons sautés", "Champignons de Paris, thym, crème fraîche", 8.5, catEntrees, [champignon, creme, thym]),
  ]);

  const [burger, pouletRoti, paveSaumon, pasta] = await Promise.all([
    createItem("Burger Maison", "Steak haché, salade, tomate, fromage fondu", 16.5, catPlats, [boeuf, salade, tomate, oignon, fromage]),
    createItem("Poulet Rôti aux Herbes", "Cuisse de poulet, thym, légumes du marché", 18.0, catPlats, [poulet, thym, poivron, oignon]),
    createItem("Pavé de Saumon", "Saumon frais, crème citronnée, légumes vapeur", 22.0, catPlats, [saumon, creme, basilic, poivre]),
    createItem("Pasta Bolognaise", "Pâtes fraîches, sauce tomate, boeuf, basilic", 14.5, catPlats, [boeuf, tomate, basilic, oignon]),
  ]);

  await Promise.all([
    createItem("Crème Brûlée", "Crème vanille, sucre caramélisé", 7.5, catDesserts, [creme]),
    createItem("Fondant Chocolat", "Coeur coulant, boule de glace vanille", 8.0, catDesserts, [beurre]),
    createItem("Eau minérale", "50cl", 3.0, catBoissons, []),
    createItem("Jus d'orange", "Pressé, frais du jour", 5.5, catBoissons, []),
    createItem("Café", "Expresso ou allongé", 2.5, catBoissons, []),
  ]);

  // --- Tables with QR codes ---
  const tables = await Promise.all(
    [
      { number: 1, capacity: 2 },
      { number: 2, capacity: 2 },
      { number: 3, capacity: 4 },
      { number: 4, capacity: 4 },
      { number: 5, capacity: 6 },
      { number: 6, capacity: 8 },
    ].map(async ({ number, capacity }) => {
      const table = await RestaurantTable.create({
        number,
        capacity,
        status: "occupied",
        restaurantId: restaurant.id,
      }).save();
      const menuUrl = `${FRONTEND_URL}/menu/${restaurant.id}?table=${table.id}&tableNum=${table.number}`;
      table.qrCode = await QRCode.toDataURL(menuUrl, { width: 256, margin: 2 });
      return table.save();
    }),
  );

  // --- Active orders (pending + preparing) ---
  await Promise.all([
    Order.create({
      restaurantId: restaurant.id,
      tableId: tables[0].id,
      status: "preparing",
      type: "food",
      items: [
        { id: burger.id, name: burger.name, price: burger.price, qty: 1 },
        { id: cesare.id, name: cesare.name, price: cesare.price, qty: 1 },
      ],
    }).save(),
    Order.create({
      restaurantId: restaurant.id,
      tableId: tables[1].id,
      status: "pending",
      type: "food",
      items: [
        { id: paveSaumon.id, name: paveSaumon.name, price: paveSaumon.price, qty: 2 },
      ],
    }).save(),
    Order.create({
      restaurantId: restaurant.id,
      tableId: tables[2].id,
      status: "pending",
      type: "food",
      items: [
        { id: burger.id, name: burger.name, price: burger.price, qty: 3 },
        { id: pouletRoti.id, name: pouletRoti.name, price: pouletRoti.price, qty: 2 },
      ],
    }).save(),
    Order.create({
      restaurantId: restaurant.id,
      tableId: tables[3].id,
      status: "preparing",
      type: "food",
      items: [
        { id: pasta.id, name: pasta.name, price: pasta.price, qty: 1 },
        { id: soupe.id, name: soupe.name, price: soupe.price, qty: 1 },
      ],
    }).save(),
  ]);

  console.log(`Demo data created — restaurant "${restaurantName}" (${restaurant.id})`);
  return { restaurantId: restaurant.id };
}
