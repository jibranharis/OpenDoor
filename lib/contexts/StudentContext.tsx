'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
    if (!user || user.role !== 'student') {
        setIsInitialized(false);
        return;
    }
    const key = `opendoor_student_${user.email}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.profile) setProfile(data.profile);
        if (data.activities) setActivities(data.activities);
        if (data.savedOpportunities) setSavedOpportunities(data.savedOpportunities);
        if (data.applications) setApplications(data.applications);
        if (data.notifications) setNotifications(data.notifications);
      } catch (e) {}
    }
    setIsInitialized(true);
  }, [user?.email, user?.role]);

  useEffect(() => {
    if (!isInitialized || !user || user.role !== 'student') return;
    const key = `opendoor_student_${user.email}`;
    localStorage.setItem(key, JSON.stringify({
      profile, activities, savedOpportunities, applications, notifications
    }));
  }, [profile, activities, savedOpportunities, applications, notifications, isInitialized, user?.email, user?.role]);

  const updateProfile = (p: Partial<StudentProfile>) => setProfile(prev => ({ ...prev, ...p }));

  const addActivity = (a: Omit<Activity, 'id'>) => {
    setActivities(prev => [{ ...a, id: Date.now().toString() }, ...prev]);
  };

  const editActivity = (id: string, a: Partial<Activity>) => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, ...a } : act));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
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
