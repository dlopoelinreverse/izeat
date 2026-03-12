import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import pubsub from "./pubsub";

import UserResolver from "./resolvers/user.resolver";
import RestaurantResolver from "./resolvers/restaurant.resolver";
import SessionResolver from "./resolvers/session.resolver";
import MenuResolver from "./resolvers/menu.resolver";
import MenuItemResolver from "./resolvers/menu-item.resolver";
import MenuCategoryResolver from "./resolvers/menu-category.resolver";
import RestaurantTableResolver from "./resolvers/restaurant-table.resolver";
import DishResolver from "./resolvers/dish.resolver";
import IngredientResolver from "./resolvers/ingredient.resolver";
import IngredientCategoryResolver from "./resolvers/ingredient-category.resolver";
import OrderResolver from "./resolvers/order.resolver";
import SubscriptionResolver from "./resolvers/subscription.resolver";

export default buildSchema({
  resolvers: [
    UserResolver,
    RestaurantResolver,
    SessionResolver,
    MenuResolver,
    MenuItemResolver,
    MenuCategoryResolver,
    RestaurantTableResolver,
    DishResolver,
    IngredientResolver,
    IngredientCategoryResolver,
    OrderResolver,
    SubscriptionResolver,
  ],
  authChecker,
  pubSub: pubsub,
});
