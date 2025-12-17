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
  id: Scalars['String']['output'];
  menuId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type MenuResponse = {
  __typename?: 'MenuResponse';
  code: Scalars['Int']['output'];
  menu?: Maybe<Menu>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MenusResponse = {
  __typename?: 'MenusResponse';
  code: Scalars['Int']['output'];
  menus?: Maybe<Array<Menu>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMenu: MenuResponse;
  createMenuCategory: MenuCategory;
  createMenuItem: MenuItem;
  createRestaurant: RestaurantResponse;
  deleteMenu: MenuResponse;
};


export type MutationCreateMenuArgs = {
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};


export type MutationCreateMenuCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateMenuItemArgs = {
  categoryId: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateRestaurantArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteMenuArgs = {
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  findUserBySession: User;
  getAllUsers: Array<User>;
  getMenuById: MenuResponse;
  getMenusByRestaurantId: MenusResponse;
  getSession: Session;
  menuCategories: Array<MenuCategory>;
  menuItems: Array<MenuItem>;
  menus: Array<Menu>;
  restaurantDashboardStatus: RestaurantResponse;
  userRestaurant: RestaurantResponse;
};


export type QueryGetMenuByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMenusByRestaurantIdArgs = {
  restaurantId: Scalars['String']['input'];
};


export type QueryGetSessionArgs = {
  token: Scalars['String']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['String']['output'];
  menus: Array<Menu>;
  name: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  tables: Array<RestaurantTable>;
};

export type RestaurantResponse = {
  __typename?: 'RestaurantResponse';
  code: Scalars['Int']['output'];
  message?: Maybe<Scalars['String']['output']>;
  restaurant?: Maybe<Restaurant>;
  success: Scalars['Boolean']['output'];
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

export type CreateMenuMutationVariables = Exact<{
  restaurantId: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateMenuMutation = { __typename?: 'Mutation', createMenu: { __typename?: 'MenuResponse', code: number, message?: string | null, success: boolean, menu?: { __typename?: 'Menu', name: string, id: string } | null } };

export type DeleteMenuMutationVariables = Exact<{
  deleteMenuId: Scalars['String']['input'];
}>;


export type DeleteMenuMutation = { __typename?: 'Mutation', deleteMenu: { __typename?: 'MenuResponse', code: number, message?: string | null, success: boolean } };

export type CreateRestaurantMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateRestaurantMutation = { __typename?: 'Mutation', createRestaurant: { __typename?: 'RestaurantResponse', code: number, message?: string | null, success: boolean, restaurant?: { __typename?: 'Restaurant', id: string, name: string, tables: Array<{ __typename?: 'RestaurantTable', id: string, number: number, status: string, capacity: number }>, menus: Array<{ __typename?: 'Menu', id: string, name: string, restaurantId: string, categories: Array<{ __typename?: 'MenuCategory', id: string, name: string }>, items: Array<{ __typename?: 'MenuItem', name: string, menuId: string, id: string }> }> } | null } };

export type GetMenuByIdQueryVariables = Exact<{
  getMenuByIdId: Scalars['String']['input'];
}>;


export type GetMenuByIdQuery = { __typename?: 'Query', getMenuById: { __typename?: 'MenuResponse', code: number, message?: string | null, success: boolean, menu?: { __typename?: 'Menu', name: string, id: string, categories: Array<{ __typename?: 'MenuCategory', id: string, name: string }> } | null } };

export type GetMenusByRestaurantIdQueryVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type GetMenusByRestaurantIdQuery = { __typename?: 'Query', getMenusByRestaurantId: { __typename?: 'MenusResponse', code: number, success: boolean, message?: string | null, menus?: Array<{ __typename?: 'Menu', name: string, id: string, restaurantId: string }> | null } };

export type RestaurantDashboardStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type RestaurantDashboardStatusQuery = { __typename?: 'Query', restaurantDashboardStatus: { __typename?: 'RestaurantResponse', code: number, message?: string | null, success: boolean, restaurant?: { __typename?: 'Restaurant', id: string, tables: Array<{ __typename?: 'RestaurantTable', id: string }>, menus: Array<{ __typename?: 'Menu', id: string, categories: Array<{ __typename?: 'MenuCategory', id: string }>, items: Array<{ __typename?: 'MenuItem', id: string }> }> } | null } };


export const CreateMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"menu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CreateMenuMutation, CreateMenuMutationVariables>;
export const DeleteMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteMenuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteMenuMutation, DeleteMenuMutationVariables>;
export const CreateRestaurantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRestaurant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRestaurant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateRestaurantMutation, CreateRestaurantMutationVariables>;
export const GetMenuByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenuById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getMenuByIdId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenuById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getMenuByIdId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"menu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetMenuByIdQuery, GetMenuByIdQueryVariables>;
export const GetMenusByRestaurantIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenusByRestaurantId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMenusByRestaurantId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}}]}}]}}]}}]} as unknown as DocumentNode<GetMenusByRestaurantIdQuery, GetMenusByRestaurantIdQueryVariables>;
export const RestaurantDashboardStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RestaurantDashboardStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restaurantDashboardStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RestaurantDashboardStatusQuery, RestaurantDashboardStatusQueryVariables>;