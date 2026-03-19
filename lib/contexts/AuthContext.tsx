'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'org' | 'admin' | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  orgName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (name: string, email: string, password: string, role: UserRole, orgName?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('opendoor_user');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('opendoor_user', JSON.stringify(newUser));
      const usersStr = localStorage.getItem('opendoor_users');
      const users = usersStr ? JSON.parse(usersStr) : {};
      
      if (newUser.role !== 'admin') {
        if (users[newUser.email]) {
          users[newUser.email] = { ...users[newUser.email], ...newUser };
        }
        localStorage.setItem('opendoor_users', JSON.stringify(users));
      }
    } else {
      localStorage.removeItem('opendoor_user');
    }
  };

  const login = (email: string, password: string, role: UserRole) => {
    if (role === 'admin') {
      if (email !== 'admin@opendoor.com' || password !== 'disney6000') {
        throw new Error('Invalid Admin credentials. Access denied.');
      }
      setUser({ id: 'admin-1', name: 'OpenDoor Admin', email: 'admin@opendoor.com', role: 'admin' });
      return;
    }

    const usersStr = localStorage.getItem('opendoor_users');
    const users = usersStr ? JSON.parse(usersStr) : {};
    const dbUser = users[email];
    
    if (dbUser) {
      if (dbUser.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      if (dbUser.role !== role) {
        throw new Error(`This email is registered as a ${dbUser.role}, not a ${role}.`);
      }
      const { password: _, ...userToSet } = dbUser;
      setUser(userToSet as AuthUser);
    } else {
      throw new Error('No account found with this email. Please sign up first.');
    }
  };

  const register = (name: string, email: string, password: string, role: UserRole, orgName?: string) => {
    const usersStr = localStorage.getItem('opendoor_users');
    const users = usersStr ? JSON.parse(usersStr) : {};

    if (users[email]) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: Date.now().toString(),
      name: name || 'User',
      email,
      password,
      role,
      orgName: role === 'org' ? orgName : undefined,
    };
    
    users[email] = newUser;
    localStorage.setItem('opendoor_users', JSON.stringify(users));

    const { password: _, ...userToSet } = newUser;
    setUser(userToSet as AuthUser);
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
