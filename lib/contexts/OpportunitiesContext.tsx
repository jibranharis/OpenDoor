'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Opportunity } from '@/lib/data/opportunities';
import { opportunities as initialOpportunities } from '@/lib/data/opportunities';
import { useAuth } from './AuthContext';
import { supabase, hasSupabase } from '@/lib/supabase';

interface OpportunitiesContextType {
  opportunities: Opportunity[];
  addOpportunity: (o: Omit<Opportunity, 'id' | 'postedDays' | 'verified' | 'trending' | 'rating' | 'applicants' | 'organization' | 'skills'>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export function OpportunitiesProvider({ children }: { children: ReactNode }) {
  const [opportunitiesState, setOpportunitiesState] = useState<Opportunity[]>(initialOpportunities);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        if (!hasSupabase) {
          setIsLoaded(true);
          return;
        }

        // 1. Fetch verification overrides and custom opportunities concurrently
        const { data: statusData, error: statusError } = await supabase.from('opportunities_status').select('*');
        const { data: customOpps, error: customError } = await supabase.from('custom_opportunities').select('*');

        setOpportunitiesState(prev => {
          let next = [...prev];
          
          // Add custom opportunities if they don't exist in hardcoded list
          if (customOpps && !customError) {
            customOpps.forEach(c => {
              if (!next.find(o => o.id === c.id)) {
                next.push({
                  ...c,
                  location: c.location || 'Remote',
                  locationType: c.location_type || 'Remote',
                  timeCommitment: c.time_commitment || 'Flexible',
                  hoursPerWeek: Number(c.hours_per_week) || 0,
                  gradeEligibility: c.grade_eligibility || '9-12',
                  deadline: c.deadline || '2024-12-31',
                  postedDays: c.posted_days || 0,
                  trending: c.trending || false,
                  rating: c.rating || 4.5,
                  applicants: c.applicants || 0,
                  contactEmail: c.contact_email || 'info@opendoor.com',
                  requirements: c.requirements || '',
                  skills: c.skills || [],
                } as any);
              }
            });
          }

          // Apply verification overrides after all opportunities are present
          if (statusData && !statusError) {
            statusData.forEach(s => {
              next = next.map(o => o.id === s.id ? { ...o, verified: s.verified } : o);
            });
          }
          
          return next;
        });
      } catch (err) {
        // Silently catch errors so the app continues gracefully with hardcoded data
      } finally {
        setIsLoaded(true);
      }
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
    if (hasSupabase) {
      const { error } = await supabase.from('custom_opportunities').insert({
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
      // Optionally handle error silently
    }
  };

  const deleteOpportunity = async (id: string) => {
    setOpportunitiesState(prev => prev.filter(opp => opp.id !== id));
    if (hasSupabase) {
      await supabase.from('custom_opportunities').delete().eq('id', id);
      await supabase.from('opportunities_status').delete().eq('id', id);
    }
  };

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    setOpportunitiesState(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    
    if (hasSupabase && updates.verified !== undefined) {
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
