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
    boeuf, poulet, saumon, foieGras,
    tomate, salade, oignon, champignon, poivron,
    fromage, creme, beurre,
    poivre, thym, basilic,
  ] = await Promise.all([
    Ingredient.create({ name: "Boeuf haché", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
    Ingredient.create({ name: "Poulet", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
    Ingredient.create({ name: "Saumon", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
    Ingredient.create({ name: "Foie gras", restaurantId: restaurant.id, ingredientCategoryId: catViandes.id }).save(),
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

  // Mark some ingredients as unavailable (rupture de stock)
  saumon.available = false;
  champignon.available = false;
  foieGras.available = false;
  await Promise.all([saumon.save(), champignon.save(), foieGras.save()]);

  // Helper to create menu item + ingredients
  const createItem = async (
    menu: Menu,
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

  // ─── MENU MIDI (active) ──────────────────────────────────────────────────

  const menuMidi = await Menu.create({
    name: "Menu Midi",
    restaurantId: restaurant.id,
    isActive: true,
  }).save();

  const [midiEntrees, midiPlats, midiDesserts, midiBoissons] = await Promise.all([
    MenuCategory.create({ name: "Entrées", menu: menuMidi, order: 0 }).save(),
    MenuCategory.create({ name: "Plats", menu: menuMidi, order: 1 }).save(),
    MenuCategory.create({ name: "Desserts", menu: menuMidi, order: 2 }).save(),
    MenuCategory.create({ name: "Boissons", menu: menuMidi, order: 3 }).save(),
  ]);

  const [cesare, soupe] = await Promise.all([
    createItem(menuMidi, "Salade César", "Poulet grillé, parmesan, croûtons maison", 10.5, midiEntrees, [salade, poulet, fromage]),
    createItem(menuMidi, "Soupe à l'oignon", "Bouillon, oignons caramélisés, gruyère fondu", 9.0, midiEntrees, [oignon, fromage, beurre]),
    createItem(menuMidi, "Champignons sautés", "Champignons de Paris, thym, crème fraîche", 8.5, midiEntrees, [champignon, creme, thym]),
  ]);

  const [burger, pouletRoti, paveSaumon, pasta] = await Promise.all([
    createItem(menuMidi, "Burger Maison", "Steak haché, salade, tomate, fromage fondu", 16.5, midiPlats, [boeuf, salade, tomate, oignon, fromage]),
    createItem(menuMidi, "Poulet Rôti aux Herbes", "Cuisse de poulet, thym, légumes du marché", 18.0, midiPlats, [poulet, thym, poivron, oignon]),
    createItem(menuMidi, "Pavé de Saumon", "Saumon frais, crème citronnée, légumes vapeur", 22.0, midiPlats, [saumon, creme, basilic, poivre]),
    createItem(menuMidi, "Pasta Bolognaise", "Pâtes fraîches, sauce tomate, boeuf, basilic", 14.5, midiPlats, [boeuf, tomate, basilic, oignon]),
  ]);

  const [cremeBrulee, eau] = await Promise.all([
    createItem(menuMidi, "Crème Brûlée", "Crème vanille, sucre caramélisé", 7.5, midiDesserts, [creme]),
    createItem(menuMidi, "Fondant Chocolat", "Coeur coulant, boule de glace vanille", 8.0, midiDesserts, [beurre]),
    createItem(menuMidi, "Eau minérale", "50cl", 3.0, midiBoissons, []),
    createItem(menuMidi, "Jus d'orange", "Pressé, frais du jour", 5.5, midiBoissons, []),
    createItem(menuMidi, "Café", "Expresso ou allongé", 2.5, midiBoissons, []),
  ]);

  // ─── MENU SOIR (inactive) ────────────────────────────────────────────────

  const menuSoir = await Menu.create({
    name: "Menu Soir",
    restaurantId: restaurant.id,
    isActive: false,
  }).save();

  const [soirEntrees, soirPlats, soirDesserts, soirVins] = await Promise.all([
    MenuCategory.create({ name: "Entrées", menu: menuSoir, order: 0 }).save(),
    MenuCategory.create({ name: "Plats", menu: menuSoir, order: 1 }).save(),
    MenuCategory.create({ name: "Desserts", menu: menuSoir, order: 2 }).save(),
    MenuCategory.create({ name: "Vins & Cocktails", menu: menuSoir, order: 3 }).save(),
  ]);

  await Promise.all([
    createItem(menuSoir, "Carpaccio de Boeuf", "Boeuf tranché fin, huile d'olive, copeaux de parmesan", 14.0, soirEntrees, [boeuf, poivre, basilic]),
    createItem(menuSoir, "Foie Gras Maison", "Terrine maison, brioche toastée, chutney de figues", 18.0, soirEntrees, [foieGras]),
    createItem(menuSoir, "Tartare de Saumon", "Saumon mariné, citron vert, herbes fraîches", 16.0, soirEntrees, [saumon, poivre, oignon]),
    createItem(menuSoir, "Côte de Boeuf (2 pers.)", "750g, sauce béarnaise, frites maison", 42.0, soirPlats, [boeuf, thym, beurre]),
    createItem(menuSoir, "Poulet Fermier Rôti", "Label Rouge, jus de cuisson, légumes rôtis", 24.0, soirPlats, [poulet, thym, poivron]),
    createItem(menuSoir, "Risotto aux Champignons", "Riz arborio, champignons des bois, parmesan", 21.0, soirPlats, [champignon, creme, fromage]),
    createItem(menuSoir, "Pavé de Saumon Béarnaise", "Saumon sauvage, sauce béarnaise, légumes de saison", 26.0, soirPlats, [saumon, creme, basilic, beurre]),
    createItem(menuSoir, "Tarte Tatin", "Pommes caramélisées, pâte feuilletée, crème fraîche", 9.0, soirDesserts, [beurre]),
    createItem(menuSoir, "Île Flottante", "Blancs en neige, crème anglaise, caramel", 7.5, soirDesserts, [creme]),
    createItem(menuSoir, "Verre de vin rouge", "Sélection du sommelier", 8.0, soirVins, []),
    createItem(menuSoir, "Verre de vin blanc", "Sélection du sommelier", 7.5, soirVins, []),
    createItem(menuSoir, "Cocktail maison", "Recette du barman, selon saison", 12.0, soirVins, []),
  ]);

  // ─── Tables with QR codes ────────────────────────────────────────────────

  const tableConfigs = [
    { number: 1, capacity: 2, status: "occupied" },
    { number: 2, capacity: 2, status: "occupied" },
    { number: 3, capacity: 4, status: "occupied" },
    { number: 4, capacity: 4, status: "occupied" },
    { number: 5, capacity: 4, status: "available" },
    { number: 6, capacity: 4, status: "available" },
    { number: 7, capacity: 6, status: "occupied" },
    { number: 8, capacity: 8, status: "available" },
  ];

  const tables = await Promise.all(
    tableConfigs.map(async ({ number, capacity, status }) => {
      const table = await RestaurantTable.create({
        number,
        capacity,
        status,
        restaurantId: restaurant.id,
      }).save();
      const menuUrl = `${FRONTEND_URL}/menu/${restaurant.id}?table=${table.id}&tableNum=${table.number}`;
      table.qrCode = await QRCode.toDataURL(menuUrl, { width: 256, margin: 2 });
      return table.save();
    }),
  );

  // ─── Active orders (on occupied tables, referencing Midi items) ──────────

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
    Order.create({
      restaurantId: restaurant.id,
      tableId: tables[6].id,
      status: "pending",
      type: "food",
      items: [
        { id: pouletRoti.id, name: pouletRoti.name, price: pouletRoti.price, qty: 2 },
        { id: cremeBrulee.id, name: cremeBrulee.name, price: cremeBrulee.price, qty: 2 },
        { id: eau.id, name: eau.name, price: eau.price, qty: 2 },
      ],
    }).save(),
  ]);

  console.log(`Demo data created — restaurant "${restaurantName}" (${restaurant.id})`);
  return { restaurantId: restaurant.id };
}
