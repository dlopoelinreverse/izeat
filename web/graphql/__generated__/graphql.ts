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

export type CreateTableInput = {
  capacity: Scalars['Float']['input'];
  number: Scalars['Float']['input'];
  restaurantId: Scalars['String']['input'];
};

export type DeleteMenuItemResponse = {
  __typename?: 'DeleteMenuItemResponse';
  id: Scalars['String']['output'];
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

export type MeResult = {
  __typename?: 'MeResult';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  onboarding?: Maybe<Onboarding>;
};

export type Menu = {
  __typename?: 'Menu';
  categories?: Maybe<Array<MenuCategory>>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  items?: Maybe<Array<MenuItem>>;
  name: Scalars['String']['output'];
  restaurantId: Scalars['String']['output'];
};

export type MenuCategory = {
  __typename?: 'MenuCategory';
  id: Scalars['String']['output'];
  items?: Maybe<Array<MenuItem>>;
  name: Scalars['String']['output'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  categoryId: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ingredients: Array<MenuItemIngredient>;
  menuId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
};

export type MenuItemIngredient = {
  __typename?: 'MenuItemIngredient';
  id: Scalars['String']['output'];
  ingredient: Ingredient;
};

export type MenuItemInput = {
  categoryId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  ingredientsId: Array<Scalars['String']['input']>;
  menuId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  restaurantId: Scalars['String']['input'];
};

export type MenuResponse = {
  __typename?: 'MenuResponse';
  categories?: Maybe<Array<MenuCategory>>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  items?: Maybe<Array<MenuItem>>;
  name: Scalars['String']['output'];
  restaurantId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createIngredient: Ingredient;
  createIngredientCategory: IngredientCategory;
  createMenu: Menu;
  createMenuCategory: MenuCategory;
  createMenuItem: MenuItem;
  createMenuItemIngredient: MenuItemIngredient;
  createOrder: Order;
  createRestaurant: Restaurant;
  createTable: RestaurantTable;
  deleteIngredient: Scalars['Boolean']['output'];
  deleteIngredientCategory: Scalars['Boolean']['output'];
  deleteMenu: Scalars['Boolean']['output'];
  deleteMenuCategory: Scalars['Boolean']['output'];
  deleteMenuItem: DeleteMenuItemResponse;
  deleteTable: Scalars['Boolean']['output'];
  setActiveMenu: Menu;
  toggleIngredientAvailable: Scalars['Boolean']['output'];
  updateIngredient: Ingredient;
  updateIngredientCategory: IngredientCategory;
  updateMenuItem: MenuItem;
  updateOrderStatus: Order;
  updateTable: RestaurantTable;
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


export type MutationCreateOrderArgs = {
  items?: InputMaybe<Array<OrderItemInput>>;
  restaurantId: Scalars['ID']['input'];
  tableId: Scalars['ID']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateRestaurantArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateTableArgs = {
  tableInput: CreateTableInput;
};


export type MutationDeleteIngredientArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteIngredientCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMenuArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMenuCategoryArgs = {
  categoryId: Scalars['String']['input'];
};


export type MutationDeleteMenuItemArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTableArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetActiveMenuArgs = {
  menuId: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};


export type MutationToggleIngredientAvailableArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateIngredientArgs = {
  input: UpdateIngredientInput;
};


export type MutationUpdateIngredientCategoryArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateMenuItemArgs = {
  id: Scalars['String']['input'];
  menuItemInput: MenuItemInput;
};


export type MutationUpdateOrderStatusArgs = {
  orderId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateTableArgs = {
  input: UpdateTableInput;
};

export type Onboarding = {
  __typename?: 'Onboarding';
  hasCategory: Scalars['Boolean']['output'];
  hasDish: Scalars['Boolean']['output'];
  hasMenu: Scalars['Boolean']['output'];
  hasRestaurant: Scalars['Boolean']['output'];
  hasTable: Scalars['Boolean']['output'];
  isReady: Scalars['Boolean']['output'];
  restaurantId?: Maybe<Scalars['String']['output']>;
  restaurantName?: Maybe<Scalars['String']['output']>;
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  items?: Maybe<Array<OrderItemSnapshot>>;
  restaurantId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tableId: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type OrderItemInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  qty: Scalars['Int']['input'];
};

export type OrderItemSnapshot = {
  __typename?: 'OrderItemSnapshot';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  qty: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  getActiveMenu?: Maybe<MenuResponse>;
  getMenu: MenuResponse;
  getMenuCategories: Array<MenuCategory>;
  getMenuItem?: Maybe<MenuItem>;
  getMenus: Array<Menu>;
  getRestaurantIngredientCategories?: Maybe<Array<IngredientCategory>>;
  getRestaurantIngredients?: Maybe<Array<Ingredient>>;
  getRestaurantOrders: Array<Order>;
  getRestaurantTables: Array<RestaurantTable>;
  getSession: Session;
  me: MeResult;
  menuItems: Array<MenuItem>;
  userRestaurant: Restaurant;
};


export type QueryGetActiveMenuArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryGetMenuArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMenuCategoriesArgs = {
  menuId: Scalars['String']['input'];
};


export type QueryGetMenuItemArgs = {
  id: Scalars['String']['input'];
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


export type QueryGetRestaurantOrdersArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryGetRestaurantTablesArgs = {
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
  qrCode?: Maybe<Scalars['String']['output']>;
  restaurantId: Scalars['String']['output'];
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

export type Subscription = {
  __typename?: 'Subscription';
  orderCreated: Order;
  orderUpdated: Order;
};


export type SubscriptionOrderCreatedArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type SubscriptionOrderUpdatedArgs = {
  restaurantId: Scalars['ID']['input'];
};

export type UpdateIngredientInput = {
  id: Scalars['String']['input'];
  ingredientCategoryId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpdateTableInput = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['String']['input'];
  number?: InputMaybe<Scalars['Float']['input']>;
  qrCode?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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

export type CreateOrderMutationVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
  tableId: Scalars['ID']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<OrderItemInput> | OrderItemInput>;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', id: string, restaurantId: string, tableId: string, status: string, type: string, createdAt: any } };

export type CreateIngredientCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
}>;


export type CreateIngredientCategoryMutation = { __typename?: 'Mutation', createIngredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } };

export type CreateIngredientMutationVariables = Exact<{
  ingredient: IngredientInput;
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: { __typename?: 'Ingredient', id: string, name: string, available: boolean, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } } };

export type DeleteIngredientCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteIngredientCategoryMutation = { __typename?: 'Mutation', deleteIngredientCategory: boolean };

export type DeleteIngredientMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteIngredientMutation = { __typename?: 'Mutation', deleteIngredient: boolean };

export type ToggleIngredientAvailableMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleIngredientAvailableMutation = { __typename?: 'Mutation', toggleIngredientAvailable: boolean };

export type UpdateIngredientCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateIngredientCategoryMutation = { __typename?: 'Mutation', updateIngredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } };

export type UpdateIngredientMutationVariables = Exact<{
  input: UpdateIngredientInput;
}>;


export type UpdateIngredientMutation = { __typename?: 'Mutation', updateIngredient: { __typename?: 'Ingredient', id: string, name: string, available: boolean, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } } };

export type CreateMenuCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
}>;


export type CreateMenuCategoryMutation = { __typename?: 'Mutation', createMenuCategory: { __typename?: 'MenuCategory', id: string, name: string } };

export type CreateMenuMutationVariables = Exact<{
  restaurantId: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateMenuMutation = { __typename?: 'Mutation', createMenu: { __typename?: 'Menu', name: string, id: string, isActive: boolean, restaurantId: string, categories?: Array<{ __typename?: 'MenuCategory', id: string, name: string }> | null, items?: Array<{ __typename?: 'MenuItem', id: string, name: string, categoryId: string, menuId: string }> | null } };

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


export type CreateMenuItemMutation = { __typename?: 'Mutation', createMenuItem: { __typename?: 'MenuItem', categoryId: string, id: string, menuId: string, name: string, description: string, price: number } };

export type DeleteMenuItemMutationVariables = Exact<{
  deleteMenuItemId: Scalars['String']['input'];
}>;


export type DeleteMenuItemMutation = { __typename?: 'Mutation', deleteMenuItem: { __typename?: 'DeleteMenuItemResponse', id: string } };

export type UpdateMenuItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
  menuItemInput: MenuItemInput;
}>;


export type UpdateMenuItemMutation = { __typename?: 'Mutation', updateMenuItem: { __typename?: 'MenuItem', id: string, menuId: string, name: string, description: string, price: number, categoryId: string, ingredients: Array<{ __typename?: 'MenuItemIngredient', ingredient: { __typename?: 'Ingredient', id: string, name: string, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } } }> } };

export type SetActiveMenuMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
}>;


export type SetActiveMenuMutation = { __typename?: 'Mutation', setActiveMenu: { __typename?: 'Menu', id: string, name: string, isActive: boolean, restaurantId: string } };

export type CreateRestaurantMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateRestaurantMutation = { __typename?: 'Mutation', createRestaurant: { __typename?: 'Restaurant', id: string, name: string, tables: Array<{ __typename?: 'RestaurantTable', id: string, number: number, status: string, capacity: number }>, menus: Array<{ __typename?: 'Menu', id: string, name: string, restaurantId: string, categories?: Array<{ __typename?: 'MenuCategory', id: string, name: string }> | null, items?: Array<{ __typename?: 'MenuItem', name: string, menuId: string, id: string }> | null }> } };

export type CreateTableMutationVariables = Exact<{
  tableInput: CreateTableInput;
}>;


export type CreateTableMutation = { __typename?: 'Mutation', createTable: { __typename?: 'RestaurantTable', capacity: number, id: string, number: number, status: string, restaurantId: string, qrCode?: string | null } };

export type DeleteTableMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteTableMutation = { __typename?: 'Mutation', deleteTable: boolean };

export type UpdateTableMutationVariables = Exact<{
  input: UpdateTableInput;
}>;


export type UpdateTableMutation = { __typename?: 'Mutation', updateTable: { __typename?: 'RestaurantTable', id: string, number: number, capacity: number, status: string, restaurantId: string, qrCode?: string | null } };

export type UpdateOrderStatusMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
}>;


export type UpdateOrderStatusMutation = { __typename?: 'Mutation', updateOrderStatus: { __typename?: 'Order', id: string, status: string } };

export type GetRestaurantOrdersQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type GetRestaurantOrdersQuery = { __typename?: 'Query', getRestaurantOrders: Array<{ __typename?: 'Order', id: string, restaurantId: string, tableId: string, status: string, type: string, createdAt: any }> };

export type GetRestaurantIngredientCategoriesQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetRestaurantIngredientCategoriesQuery = { __typename?: 'Query', getRestaurantIngredientCategories?: Array<{ __typename?: 'IngredientCategory', id: string, name: string }> | null };

export type GetRestaurantIngredientsQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetRestaurantIngredientsQuery = { __typename?: 'Query', getRestaurantIngredients?: Array<{ __typename?: 'Ingredient', id: string, name: string, available: boolean, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } }> | null };

export type GetActiveMenuQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetActiveMenuQuery = { __typename?: 'Query', getActiveMenu?: { __typename?: 'MenuResponse', id: string, name: string, isActive: boolean, restaurantId: string, categories?: Array<{ __typename?: 'MenuCategory', id: string, name: string, items?: Array<{ __typename?: 'MenuItem', id: string, name: string, description: string, price: number, ingredients: Array<{ __typename?: 'MenuItemIngredient', ingredient: { __typename?: 'Ingredient', name: string } }> }> | null }> | null } | null };

export type GetMenuCategoriesQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
}>;


export type GetMenuCategoriesQuery = { __typename?: 'Query', getMenuCategories: Array<{ __typename?: 'MenuCategory', id: string, name: string, items?: Array<{ __typename?: 'MenuItem', categoryId: string, id: string, menuId: string, name: string }> | null }> };

export type GetMenuQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
}>;


export type GetMenuQuery = { __typename?: 'Query', getMenu: { __typename?: 'MenuResponse', id: string, name: string, categories?: Array<{ __typename?: 'MenuCategory', id: string, name: string, items?: Array<{ __typename?: 'MenuItem', id: string }> | null }> | null } };

export type GetMenusQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetMenusQuery = { __typename?: 'Query', getMenus: Array<{ __typename?: 'Menu', id: string, isActive: boolean, name: string, restaurantId: string, categories?: Array<{ __typename?: 'MenuCategory', id: string }> | null, items?: Array<{ __typename?: 'MenuItem', id: string }> | null }> };

export type GetMenuItemQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMenuItemQuery = { __typename?: 'Query', getMenuItem?: { __typename?: 'MenuItem', id: string, name: string, description: string, price: number, categoryId: string, ingredients: Array<{ __typename?: 'MenuItemIngredient', ingredient: { __typename?: 'Ingredient', id: string, name: string, available: boolean, ingredientCategory: { __typename?: 'IngredientCategory', id: string, name: string } } }> } | null };

export type GetRestaurantTablesQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetRestaurantTablesQuery = { __typename?: 'Query', getRestaurantTables: Array<{ __typename?: 'RestaurantTable', capacity: number, id: string, number: number, status: string, restaurantId: string, qrCode?: string | null }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'MeResult', id: string, name: string, onboarding?: { __typename?: 'Onboarding', hasRestaurant: boolean, restaurantId?: string | null, restaurantName?: string | null, hasMenu: boolean, hasCategory: boolean, hasDish: boolean, hasTable: boolean, isReady: boolean } | null } };

export type OrderCreatedSubscriptionVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type OrderCreatedSubscription = { __typename?: 'Subscription', orderCreated: { __typename?: 'Order', id: string, restaurantId: string, tableId: string, status: string, type: string, createdAt: any } };

export type OrderUpdatedSubscriptionVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type OrderUpdatedSubscription = { __typename?: 'Subscription', orderUpdated: { __typename?: 'Order', id: string, restaurantId: string, tableId: string, status: string, type: string, createdAt: any } };


export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"items"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItemInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tableId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"items"},"value":{"kind":"Variable","name":{"kind":"Name","value":"items"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const CreateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateIngredientCategoryMutation, CreateIngredientCategoryMutationVariables>;
export const CreateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ingredient"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredient"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ingredient"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateIngredientMutation, CreateIngredientMutationVariables>;
export const DeleteIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteIngredientCategoryMutation, DeleteIngredientCategoryMutationVariables>;
export const DeleteIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteIngredientMutation, DeleteIngredientMutationVariables>;
export const ToggleIngredientAvailableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleIngredientAvailable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleIngredientAvailable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ToggleIngredientAvailableMutation, ToggleIngredientAvailableMutationVariables>;
export const UpdateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateIngredientCategoryMutation, UpdateIngredientCategoryMutationVariables>;
export const UpdateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateIngredientMutation, UpdateIngredientMutationVariables>;
export const CreateMenuCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenuCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenuCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateMenuCategoryMutation, CreateMenuCategoryMutationVariables>;
export const CreateMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateMenuMutation, CreateMenuMutationVariables>;
export const DeleteMenuCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMenuCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMenuCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}]}]}}]} as unknown as DocumentNode<DeleteMenuCategoryMutation, DeleteMenuCategoryMutationVariables>;
export const DeleteMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuId"}}}]}]}}]} as unknown as DocumentNode<DeleteMenuMutation, DeleteMenuMutationVariables>;
export const CreateMenuItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenuItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenuItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<CreateMenuItemMutation, CreateMenuItemMutationVariables>;
export const DeleteMenuItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMenuItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuItemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMenuItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuItemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteMenuItemMutation, DeleteMenuItemMutationVariables>;
export const UpdateMenuItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMenuItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMenuItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"menuItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMenuItemMutation, UpdateMenuItemMutationVariables>;
export const SetActiveMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetActiveMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setActiveMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]} as unknown as DocumentNode<SetActiveMenuMutation, SetActiveMenuMutationVariables>;
export const CreateRestaurantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRestaurant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRestaurant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRestaurantMutation, CreateRestaurantMutationVariables>;
export const CreateTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tableInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"qrCode"}}]}}]}}]} as unknown as DocumentNode<CreateTableMutation, CreateTableMutationVariables>;
export const DeleteTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTableMutation, DeleteTableMutationVariables>;
export const UpdateTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"qrCode"}}]}}]}}]} as unknown as DocumentNode<UpdateTableMutation, UpdateTableMutationVariables>;
export const UpdateOrderStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrderStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrderStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;
export const GetRestaurantOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRestaurantOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRestaurantOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetRestaurantOrdersQuery, GetRestaurantOrdersQueryVariables>;
export const GetRestaurantIngredientCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRestaurantIngredientCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRestaurantIngredientCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRestaurantIngredientCategoriesQuery, GetRestaurantIngredientCategoriesQueryVariables>;
export const GetRestaurantIngredientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRestaurantIngredients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRestaurantIngredients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetRestaurantIngredientsQuery, GetRestaurantIngredientsQueryVariables>;
export const GetActiveMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveMenuQuery, GetActiveMenuQueryVariables>;
export const GetMenuCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenuCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenuCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetMenuCategoriesQuery, GetMenuCategoriesQueryVariables>;
export const GetMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMenuQuery, GetMenuQueryVariables>;
export const GetMenusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]} as unknown as DocumentNode<GetMenusQuery, GetMenusQueryVariables>;
export const GetMenuItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenuItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenuItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMenuItemQuery, GetMenuItemQueryVariables>;
export const GetRestaurantTablesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRestaurantTables"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRestaurantTables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"qrCode"}}]}}]}}]} as unknown as DocumentNode<GetRestaurantTablesQuery, GetRestaurantTablesQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRestaurant"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantName"}},{"kind":"Field","name":{"kind":"Name","value":"hasMenu"}},{"kind":"Field","name":{"kind":"Name","value":"hasCategory"}},{"kind":"Field","name":{"kind":"Name","value":"hasDish"}},{"kind":"Field","name":{"kind":"Name","value":"hasTable"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const OrderCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OrderCreated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderCreated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<OrderCreatedSubscription, OrderCreatedSubscriptionVariables>;
export const OrderUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OrderUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<OrderUpdatedSubscription, OrderUpdatedSubscriptionVariables>;