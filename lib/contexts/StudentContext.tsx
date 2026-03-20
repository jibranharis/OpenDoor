'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

export interface Activity {
  id: string;
  orgName: string;
  role: string;
  description: string;
  category: string;
  hoursPerWeek: number;
  totalHours: number;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
}

export interface StudentProfile {
  name: string;
  grade: string;
  school: string;
  interests: string[];
  bio: string;
  resumeUploaded: boolean;
}

interface StudentContextType {
  profile: StudentProfile;
  updateProfile: (p: Partial<StudentProfile>) => void;
  activities: Activity[];
  addActivity: (a: Omit<Activity, 'id'>) => void;
  editActivity: (id: string, a: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  totalHours: number;
  savedOpportunities: string[];
  toggleSaved: (id: string) => void;
  applications: Application[];
  addApplication: (a: Application) => void;
  notifications: AppNotification[];
  markNotifRead: (id: string) => void;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organization: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Accepted' | 'Rejected';
  message: string;
}

export interface AppNotification {
  id: string;
  type: 'opportunity' | 'application' | 'milestone';
  message: string;
  time: string;
  read: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>({
    name: '', grade: '11', school: '', interests: [], bio: '', resumeUploaded: false,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'student') {
        setIsInitialized(false);
        return;
      }

      // 1. Fetch from Supabase
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();
        
      if (dbProfile) {
        setProfile({
          name: dbProfile.name || '',
          grade: '11', // Default or could be in DB
          school: dbProfile.school || '',
          interests: [],
          bio: dbProfile.bio || '',
          resumeUploaded: false
        });
      }

      const { data: dbActivities } = await supabase
        .from('activities')
        .select('*')
        .eq('user_email', user.email);
        
      if (dbActivities) {
        setActivities(dbActivities.map(a => ({
          id: a.id,
          orgName: a.org_name,
          role: a.role,
          category: a.category,
          hoursPerWeek: Number(a.hours_per_week),
          totalHours: Number(a.total_hours),
          description: a.description || '',
          startDate: a.date || '',
          endDate: '',
          isOngoing: false
        })));
      }

      // 2. Legacy Local Fallback
      const key = `opendoor_student_${user.email}`;
      const stored = localStorage.getItem(key);
      if (stored && !dbProfile && !dbActivities) {
        try {
          const data = JSON.parse(stored);
          if (data.profile) setProfile(data.profile);
          if (data.activities) setActivities(data.activities);
          if (data.savedOpportunities) setSavedOpportunities(data.savedOpportunities);
          if (data.applications) setApplications(data.applications);
        } catch (e) {}
      }
      
      setIsInitialized(true);
    };

    fetchData();
  }, [user?.email, user?.role]);

  useEffect(() => {
    if (!isInitialized || !user || user.role !== 'student') return;
    
    // Sync to LocalStorage for safety/offline
    const key = `opendoor_student_${user.email}`;
    localStorage.setItem(key, JSON.stringify({
      profile, activities, savedOpportunities, applications, notifications
    }));

    // Sync to Supabase
    const syncToCloud = async () => {
      // Update profile school/bio in 'profiles'
      await supabase.from('profiles').update({
        school: profile.school,
        // grade: profile.grade, -- add if table updated
      }).eq('email', user.email);
    };
    
    syncToCloud();
  }, [profile, activities, savedOpportunities, applications, notifications, isInitialized, user?.email, user?.role]);

  const updateProfile = (p: Partial<StudentProfile>) => setProfile(prev => ({ ...prev, ...p }));

  const addActivity = async (a: Omit<Activity, 'id'>) => {
    const newId = crypto.randomUUID();
    const newAct = { ...a, id: newId };
    setActivities(prev => [newAct, ...prev]);

    if (user?.email) {
      await supabase.from('activities').insert({
        id: newId,
        user_email: user.email,
        org_name: a.orgName,
        role: a.role,
        category: a.category,
        hours_per_week: a.hoursPerWeek,
        total_hours: a.totalHours,
        description: a.description,
        date: a.startDate
      });
    }
  };

  const editActivity = async (id: string, a: Partial<Activity>) => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, ...a } : act));
    
    if (user?.email) {
      await supabase.from('activities').update({
        org_name: a.orgName,
        role: a.role,
        category: a.category,
        hours_per_week: a.hoursPerWeek,
        total_hours: a.totalHours,
        description: a.description,
        date: a.startDate
      }).eq('id', id);
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    await supabase.from('activities').delete().eq('id', id);
  };

  const totalHours = activities.reduce((sum, a) => sum + a.totalHours, 0);

  const toggleSaved = (id: string) => {
    setSavedOpportunities(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const addApplication = (a: Application) => {
    setApplications(prev => [a, ...prev]);
  };

  const markNotifRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <StudentContext.Provider value={{
      profile, updateProfile,
      activities, addActivity, editActivity, deleteActivity,
      totalHours,
      savedOpportunities, toggleSaved,
      applications, addApplication,
      notifications, markNotifRead,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be used within StudentProvider');
  return ctx;
}
