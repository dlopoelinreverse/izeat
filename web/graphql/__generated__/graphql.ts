import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  accessToken?: Maybe<Scalars['String']['output']>;
  accessTokenExpiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
  accountId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  idToken?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  providerId: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  refreshTokenExpiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type Ingredient = {
  __typename?: 'Ingredient';
  available: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  ingredientCategory: IngredientCategory;
  name: Scalars['String']['output'];
};

export type IngredientCategory = {
  __typename?: 'IngredientCategory';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type IngredientInput = {
  ingredientCategoryId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};

export type Menu = {
  __typename?: 'Menu';
  categories: Array<MenuCategory>;
  id: Scalars['String']['output'];
  items: Array<MenuItem>;
  name: Scalars['String']['output'];
  restaurantId: Scalars['String']['output'];
};

export type MenuCategory = {
  __typename?: 'MenuCategory';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  categoryId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ingredients: Array<MenuItemIngredient>;
  menuId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type MenuItemIngredient = {
  __typename?: 'MenuItemIngredient';
  id: Scalars['String']['output'];
  ingredient: Ingredient;
};

export type MenuItemInput = {
  categoryId: Scalars['String']['input'];
  ingredientsId: Array<Scalars['String']['input']>;
  menuId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createIngredient: Ingredient;
  createIngredientCategory: IngredientCategory;
  createMenu: Menu;
  createMenuCategory: MenuCategory;
  createMenuItem: MenuItem;
  createMenuItemIngredient: MenuItemIngredient;
  createRestaurant: Restaurant;
  deleteMenu: Scalars['Boolean']['output'];
  deleteMenuCategory: Scalars['Boolean']['output'];
};


export type MutationCreateIngredientArgs = {
  ingredient: IngredientInput;
};


export type MutationCreateIngredientCategoryArgs = {
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};


export type MutationCreateMenuArgs = {
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};


export type MutationCreateMenuCategoryArgs = {
  menuId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateMenuItemArgs = {
  menuItemInput: MenuItemInput;
};


export type MutationCreateMenuItemIngredientArgs = {
  ingredientId: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
};


export type MutationCreateRestaurantArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteMenuArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMenuCategoryArgs = {
  categoryId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  findUserBySession: User;
  getAllUsers: Array<User>;
  getMenu: Menu;
  getMenuCategories: Array<MenuCategory>;
  getMenus: Array<Menu>;
  getRestaurantIngredientCategories?: Maybe<Array<IngredientCategory>>;
  getRestaurantIngredients?: Maybe<Array<Ingredient>>;
  getSession: Session;
  menuItems: Array<MenuItem>;
  restaurantDashboardStatus?: Maybe<Restaurant>;
  userRestaurant: Restaurant;
};


export type QueryGetMenuArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMenuCategoriesArgs = {
  menuId: Scalars['String']['input'];
};


export type QueryGetMenusArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryGetRestaurantIngredientCategoriesArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryGetRestaurantIngredientsArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryGetSessionArgs = {
  token: Scalars['String']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  categories: Array<IngredientCategory>;
  id: Scalars['String']['output'];
  ingredients: Array<Ingredient>;
  menus: Array<Menu>;
  name: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  tables: Array<RestaurantTable>;
};

export type RestaurantTable = {
  __typename?: 'RestaurantTable';
  capacity: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  number: Scalars['Float']['output'];
  status: Scalars['String']['output'];
};

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['DateTimeISO']['output'];
  expiresAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  accounts: Array<Account>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  restaurants: Array<Restaurant>;
  sessions: Array<Session>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type CreateIngredientCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
}>;


export type CreateIngredientCategoryMutation = { __typename?: 'Mutation', createIngredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } };

export type CreateIngredientMutationVariables = Exact<{
  ingredient: IngredientInput;
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: { __typename?: 'Ingredient', id: string, name: string, available: boolean, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } } };

export type CreateMenuCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
}>;


export type CreateMenuCategoryMutation = { __typename?: 'Mutation', createMenuCategory: { __typename?: 'MenuCategory', id: string, name: string } };

export type CreateMenuMutationVariables = Exact<{
  restaurantId: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateMenuMutation = { __typename?: 'Mutation', createMenu: { __typename?: 'Menu', name: string, id: string } };

export type DeleteMenuCategoryMutationVariables = Exact<{
  categoryId: Scalars['String']['input'];
}>;


export type DeleteMenuCategoryMutation = { __typename?: 'Mutation', deleteMenuCategory: boolean };

export type DeleteMenuMutationVariables = Exact<{
  deleteMenuId: Scalars['String']['input'];
}>;


export type DeleteMenuMutation = { __typename?: 'Mutation', deleteMenu: boolean };

export type CreateMenuItemMutationVariables = Exact<{
  menuItemInput: MenuItemInput;
}>;


export type CreateMenuItemMutation = { __typename?: 'Mutation', createMenuItem: { __typename?: 'MenuItem', categoryId: string, id: string, menuId: string, name: string } };

export type CreateRestaurantMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateRestaurantMutation = { __typename?: 'Mutation', createRestaurant: { __typename?: 'Restaurant', id: string, name: string, tables: Array<{ __typename?: 'RestaurantTable', id: string, number: number, status: string, capacity: number }>, menus: Array<{ __typename?: 'Menu', id: string, name: string, restaurantId: string, categories: Array<{ __typename?: 'MenuCategory', id: string, name: string }>, items: Array<{ __typename?: 'MenuItem', name: string, menuId: string, id: string }> }> } };

export type GetRestaurantIngredientCategoriesQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetRestaurantIngredientCategoriesQuery = { __typename?: 'Query', getRestaurantIngredientCategories?: Array<{ __typename?: 'IngredientCategory', id: string, name: string }> | null };

export type GetRestaurantIngredientsQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetRestaurantIngredientsQuery = { __typename?: 'Query', getRestaurantIngredients?: Array<{ __typename?: 'Ingredient', id: string, name: string, available: boolean, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } }> | null };

export type GetMenuCategoriesQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
}>;


export type GetMenuCategoriesQuery = { __typename?: 'Query', getMenuCategories: Array<{ __typename?: 'MenuCategory', id: string, name: string }> };

export type GetMenuQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
}>;


export type GetMenuQuery = { __typename?: 'Query', getMenu: { __typename?: 'Menu', id: string, name: string, restaurantId: string, categories: Array<{ __typename?: 'MenuCategory', id: string, name: string }>, items: Array<{ __typename?: 'MenuItem', categoryId: string, id: string, menuId: string, name: string, ingredients: Array<{ __typename?: 'MenuItemIngredient', id: string }> }> } };

export type GetMenusQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetMenusQuery = { __typename?: 'Query', getMenus: Array<{ __typename?: 'Menu', id: string, name: string, restaurantId: string, categories: Array<{ __typename?: 'MenuCategory', id: string, name: string }>, items: Array<{ __typename?: 'MenuItem', categoryId: string, id: string, menuId: string, name: string }> }> };

export type RestaurantDashboardStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type RestaurantDashboardStatusQuery = { __typename?: 'Query', restaurantDashboardStatus?: { __typename?: 'Restaurant', id: string, name: string, tables: Array<{ __typename?: 'RestaurantTable', id: string }>, menus: Array<{ __typename?: 'Menu', id: string, categories: Array<{ __typename?: 'MenuCategory', id: string }>, items: Array<{ __typename?: 'MenuItem', id: string }> }> } | null };


export const CreateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateIngredientCategoryMutation, CreateIngredientCategoryMutationVariables>;
export const CreateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ingredient"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredient"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ingredient"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateIngredientMutation, CreateIngredientMutationVariables>;
export const CreateMenuCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenuCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenuCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateMenuCategoryMutation, CreateMenuCategoryMutationVariables>;
export const CreateMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMenuMutation, CreateMenuMutationVariables>;
export const DeleteMenuCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMenuCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMenuCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}]}]}}]} as unknown as DocumentNode<DeleteMenuCategoryMutation, DeleteMenuCategoryMutationVariables>;
export const DeleteMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuId"}}}]}]}}]} as unknown as DocumentNode<DeleteMenuMutation, DeleteMenuMutationVariables>;
export const CreateMenuItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenuItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenuItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateMenuItemMutation, CreateMenuItemMutationVariables>;
export const CreateRestaurantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRestaurant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRestaurant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRestaurantMutation, CreateRestaurantMutationVariables>;
export const GetRestaurantIngredientCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRestaurantIngredientCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRestaurantIngredientCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRestaurantIngredientCategoriesQuery, GetRestaurantIngredientCategoriesQueryVariables>;
export const GetRestaurantIngredientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRestaurantIngredients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRestaurantIngredients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetRestaurantIngredientsQuery, GetRestaurantIngredientsQueryVariables>;
export const GetMenuCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenuCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenuCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetMenuCategoriesQuery, GetMenuCategoriesQueryVariables>;
export const GetMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]} as unknown as DocumentNode<GetMenuQuery, GetMenuQueryVariables>;
export const GetMenusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]} as unknown as DocumentNode<GetMenusQuery, GetMenusQueryVariables>;
export const RestaurantDashboardStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RestaurantDashboardStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restaurantDashboardStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RestaurantDashboardStatusQuery, RestaurantDashboardStatusQueryVariables>;