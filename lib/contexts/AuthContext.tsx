'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, hasSupabase } from '@/lib/supabase';

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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, orgName?: string) => Promise<void>;
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

  const setUser = async (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('opendoor_user', JSON.stringify(newUser));
      
      // Sync to Supabase Profiles table if not admin
      if (newUser.role !== 'admin' && hasSupabase) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: newUser.id.includes('-') ? newUser.id : undefined, // Check if it's already a UUID
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            avatar: newUser.avatar,
            org_name: newUser.orgName
          }, { onConflict: 'email' });
          
        if (error) console.error('Error syncing profile to cloud:', error);
      }
    } else {
      localStorage.removeItem('opendoor_user');
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    if (role === 'admin') {
      if (email !== 'admin@opendoor.com' || password !== 'disney6000') {
        throw new Error('Invalid Admin credentials. Access denied.');
      }
      setUser({ id: 'admin-1', name: 'OpenDoor Admin', email: 'admin@opendoor.com', role: 'admin' });
      return;
    }

    // Attempt Supabase login first
    if (hasSupabase) {
      try {
        const { data: dbUser, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (dbUser && !error) {
          if (dbUser.password && dbUser.password !== password) {
            throw new Error('Incorrect password. Please try again.');
          }
          setUser({
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as UserRole,
            avatar: dbUser.avatar,
            orgName: dbUser.org_name
          });
          return;
        }
      } catch (e) {
        // Silently fall back to local if cloud fails
      }
    }

    // Fallback/Legacy Local login (to help migration)
    const usersStr = localStorage.getItem('opendoor_users');
    const users = usersStr ? JSON.parse(usersStr) : {};
    const localUser = users[email];
    
    if (localUser) {
      if (localUser.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      const { password: _, ...userToSet } = localUser;
      setUser(userToSet as AuthUser);
    } else {
      throw new Error('No account found with this email. Please sign up first.');
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, orgName?: string) => {
    // Check if user exists in Supabase
    if (hasSupabase) {
      try {
        const { data: existing } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .single();

        if (existing) {
          throw new Error('An account with this email already exists in the cloud. Please log in.');
        }
      } catch (e: any) {
        if (e.message && e.message.includes('already exists')) throw e;
      }
    }

    const userId = crypto.randomUUID();
    const newUser = {
      id: userId,
      name: name || 'User',
      email,
      role,
      avatar: undefined,
      orgName: role === 'org' ? orgName : undefined,
    };

    // Insert into Supabase
    if (hasSupabase) {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          name: newUser.name,
          password, // For simple demo persistence
          role,
          org_name: newUser.orgName
        });

      if (error) {
        console.error('Migration Error:', error);
        throw new Error('Failed to create account in the cloud: ' + error.message);
      }
    }

    // Legacy sync for local safety
    const usersStr = localStorage.getItem('opendoor_users');
    const users = usersStr ? JSON.parse(usersStr) : {};
    users[email] = { ...newUser, password };
    localStorage.setItem('opendoor_users', JSON.stringify(users));

    setUser(newUser as AuthUser);
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
