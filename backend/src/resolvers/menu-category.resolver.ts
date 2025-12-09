import { Arg, Mutation, Query, Resolver } from "type-graphql";
import MenuCategory from "../entities/menu-category.entity";

@Resolver()
class MenuCategoryResolver {
  @Query(() => [MenuCategory])
  async menuCategories() {
    return MenuCategory.find();
  }

  @Mutation(() => MenuCategory)
  async createMenuCategory(@Arg("name", () => String) name: string) {
    const menuCategory = await MenuCategory.create({ name }).save();
    return menuCategory;
  }
}

export default MenuCategoryResolver;
