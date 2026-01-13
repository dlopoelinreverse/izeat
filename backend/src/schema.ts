import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";

import UserResolver from "./resolvers/user.resolver";
import RestaurantResolver from "./resolvers/restaurant.resolver";
import SessionResolver from "./resolvers/session.resolver";
import MenuResolver from "./resolvers/menu.resolver";
import MenuItemResolver from "./resolvers/menu-item.resolver";
import MenuCategoryResolver from "./resolvers/menu-category.resolver";
import RestaurantTableResolver from "./resolvers/restaurant-table.resolver";
import MenuIngredientResolver from "./resolvers/menu-ingredient.resolver";
import MenuItemIngredientResolver from "./resolvers/menu-item-ingredient.resolver";
import IngredientResolver from "./resolvers/ingredient.resolver";
import IngredientCategoryResolver from "./resolvers/ingredient-category.resolver";

export default buildSchema({
  resolvers: [
    UserResolver,
    RestaurantResolver,
    SessionResolver,
    MenuResolver,
    MenuItemResolver,
    MenuCategoryResolver,
    RestaurantTableResolver,
    MenuIngredientResolver,
    MenuItemIngredientResolver,
    IngredientResolver,
    IngredientCategoryResolver,
  ],
  authChecker,
});
