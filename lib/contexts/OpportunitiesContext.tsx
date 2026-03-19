'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Opportunity } from '@/lib/data/opportunities';
import { opportunities as initialOpportunities } from '@/lib/data/opportunities';
import { useAuth } from './AuthContext';

interface OpportunitiesContextType {
  opportunities: Opportunity[];
  addOpportunity: (o: Omit<Opportunity, 'id' | 'postedDays' | 'verified' | 'trending' | 'rating' | 'applicants' | 'organization' | 'skills'>) => void;
  deleteOpportunity: (id: string) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export function OpportunitiesProvider({ children }: { children: ReactNode }) {
  const [opportunitiesState, setOpportunitiesState] = useState<Opportunity[]>(initialOpportunities);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('opendoor_opportunities');
    if (stored) {
      try {
        setOpportunitiesState(JSON.parse(stored));
      } catch (e) {}
    } else {
        localStorage.setItem('opendoor_opportunities', JSON.stringify(initialOpportunities));
    }
    setIsLoaded(true);
  }, []);

  const setOpportunities = (items: Opportunity[] | ((prev: Opportunity[]) => Opportunity[])) => {
    setOpportunitiesState(prev => {
      const next = typeof items === 'function' ? items(prev) : items;
      localStorage.setItem('opendoor_opportunities', JSON.stringify(next));
      return next;
    });
  };

  const opportunities = opportunitiesState;

  const addOpportunity = (o: Omit<Opportunity, 'id' | 'postedDays' | 'verified' | 'trending' | 'rating' | 'applicants' | 'organization' | 'skills'>) => {
    const newOpp: Opportunity = {
      ...o,
      id: Date.now().toString(),
      organization: user?.orgName || 'Organization',
      postedDays: 0,
      verified: false,
      trending: false,
      rating: 0,
      applicants: 0,
      skills: [],
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  return (
    <OpportunitiesContext.Provider value={{ opportunities, addOpportunity, deleteOpportunity, updateOpportunity }}>
      {children}
    </OpportunitiesContext.Provider>
  );
}

export function useOpportunities() {
  const ctx = useContext(OpportunitiesContext);
  if (!ctx) throw new Error('useOpportunities must be used within OpportunitiesProvider');
  return ctx;
}
