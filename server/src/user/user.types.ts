/* eslint-disable prettier/prettier */
import { Users } from '@prisma/client';

// extends non-nullable utility type for object entries
export type NonNullableMap<T extends Record<string, any>> = {
  [K in keyof T]: NonNullable<T[K]>;
};

// Expected body shape for the create user API
export type CreateUserDto = Pick<
  Users,
  'email' | 'name' | 'password' | 'phone_number'
>;

// Expected body shape for the update user API
export type UpdateUserDto = Partial<
  Pick<Users, 'email' | 'name' | 'password' | 'phone_number'>
>;

// Expected body shape for the authenticate user API
export type AuthenticateUserDto =
  | Pick<Users, 'email' | 'password'>
  | NonNullableMap<Pick<Users, 'phone_number' | 'password'>>
  | { jwt: string };
