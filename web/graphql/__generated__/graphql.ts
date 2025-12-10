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
  id: Scalars['String']['output'];
  items: Array<MenuItem>;
  name: Scalars['String']['output'];
  restaurant: Restaurant;
  restaurantId: Scalars['String']['output'];
};

export type MenuCategory = {
  __typename?: 'MenuCategory';
  id: Scalars['String']['output'];
  items: Array<MenuItem>;
  name: Scalars['String']['output'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  category: MenuCategory;
  categoryId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  menu: Menu;
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

export type Mutation = {
  __typename?: 'Mutation';
  createMenu: MenuResponse;
  createMenuCategory: MenuCategory;
  createMenuItem: MenuItem;
  createRestaurant: Restaurant;
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
  getAllRestaurants: Array<Restaurant>;
  getAllUsers: Array<User>;
  getDashboardRestaurantStatus?: Maybe<Restaurant>;
  getSession: Session;
  getUserRestaurant?: Maybe<Restaurant>;
  menuCategories: Array<MenuCategory>;
  menuItems: Array<MenuItem>;
  menus: Array<Menu>;
};


export type QueryGetSessionArgs = {
  token: Scalars['String']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['String']['output'];
  menus: Array<Menu>;
  name: Scalars['String']['output'];
  owner: User;
  tables: Array<RestaurantTable>;
};

export type RestaurantTable = {
  __typename?: 'RestaurantTable';
  capacity: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  number: Scalars['Float']['output'];
  restaurant: Restaurant;
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

export type CreateRestaurantMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateRestaurantMutation = { __typename?: 'Mutation', createRestaurant: { __typename?: 'Restaurant', id: string, name: string } };

export type GetDashboardRestaurantStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardRestaurantStatusQuery = { __typename?: 'Query', getDashboardRestaurantStatus?: { __typename?: 'Restaurant', name: string, id: string, menus: Array<{ __typename?: 'Menu', id: string, items: Array<{ __typename?: 'MenuItem', id: string, category: { __typename?: 'MenuCategory', id: string } }> }>, tables: Array<{ __typename?: 'RestaurantTable', id: string }> } | null };

export type GetUserRestaurantQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserRestaurantQuery = { __typename?: 'Query', getUserRestaurant?: { __typename?: 'Restaurant', id: string, name: string } | null };


export const CreateMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"menu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CreateMenuMutation, CreateMenuMutationVariables>;
export const CreateRestaurantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRestaurant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRestaurant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateRestaurantMutation, CreateRestaurantMutationVariables>;
export const GetDashboardRestaurantStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardRestaurantStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDashboardRestaurantStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetDashboardRestaurantStatusQuery, GetDashboardRestaurantStatusQueryVariables>;
export const GetUserRestaurantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRestaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserRestaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetUserRestaurantQuery, GetUserRestaurantQueryVariables>;