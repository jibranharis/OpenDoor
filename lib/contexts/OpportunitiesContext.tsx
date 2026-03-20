'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Opportunity } from '@/lib/data/opportunities';
import { opportunities as initialOpportunities } from '@/lib/data/opportunities';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

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
    const fetchCloudData = async () => {
      // 1. Fetch verification overrides
      const { data: statusData } = await supabase.from('opportunities_status').select('*');
      
      // 2. Fetch custom opportunities
      const { data: customOpps } = await supabase.from('custom_opportunities').select('*');

      setOpportunitiesState(prev => {
        let next = [...prev];
        
        // Apply verification overrides
        if (statusData) {
          statusData.forEach(s => {
            next = next.map(o => o.id === s.id ? { ...o, verified: s.verified } : o);
          });
        }

        // Add custom opportunities if they don't exist in hardcoded list
        if (customOpps) {
          customOpps.forEach(c => {
            if (!next.find(o => o.id === c.id)) {
              next.push({
                ...c,
                locationType: c.location_type,
                timeCommitment: c.time_commitment,
                hoursPerWeek: Number(c.hours_per_week),
              } as any);
            }
          });
        }
        
        return next;
      });
      
      setIsLoaded(true);
    };

    fetchCloudData();
  }, []);

  const setOpportunities = (items: Opportunity[] | ((prev: Opportunity[]) => Opportunity[])) => {
    setOpportunitiesState(prev => {
      const next = typeof items === 'function' ? items(prev) : items;
      localStorage.setItem('opendoor_opportunities', JSON.stringify(next));
      return next;
    });
  };

  const opportunities = opportunitiesState;

  const addOpportunity = async (o: Omit<Opportunity, 'id' | 'postedDays' | 'verified' | 'trending' | 'rating' | 'applicants' | 'organization' | 'skills'>) => {
    const newId = Date.now().toString();
    const newOpp: Opportunity = {
      ...o,
      id: newId,
      organization: user?.orgName || 'Organization',
      postedDays: 0,
      verified: false,
      trending: false,
      rating: 0,
      applicants: 0,
      skills: [],
    };
    setOpportunitiesState(prev => [newOpp, ...prev]);

    // Sync to Supabase
    await supabase.from('custom_opportunities').insert({
      id: newId,
      title: o.title,
      organization: user?.orgName || 'Organization',
      category: o.category,
      location_type: o.locationType,
      time_commitment: o.timeCommitment,
      hours_per_week: o.hoursPerWeek,
      description: o.description,
      verified: false
    });
  };

  const deleteOpportunity = async (id: string) => {
    setOpportunitiesState(prev => prev.filter(opp => opp.id !== id));
    await supabase.from('custom_opportunities').delete().eq('id', id);
    await supabase.from('opportunities_status').delete().eq('id', id);
  };

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    setOpportunitiesState(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    
    if (updates.verified !== undefined) {
      await supabase.from('opportunities_status').upsert({ id, verified: updates.verified });
      await supabase.from('custom_opportunities').update({ verified: updates.verified }).eq('id', id);
    }
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
