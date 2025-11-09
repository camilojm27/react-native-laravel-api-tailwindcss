import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  username?: string | null;
  phone_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});
