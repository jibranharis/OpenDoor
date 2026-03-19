export type Category = 'Medical' | 'Nonprofit' | 'Education' | 'Business' | 'STEM' | 'Arts' | 'Environment' | 'Community';
export type TimeCommitment = 'One-time' | 'Weekly' | 'Summer' | 'Flexible';
export type LocationType = 'In-Person' | 'Remote' | 'Hybrid';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: Category;
  location: string;
  locationType: LocationType;
  timeCommitment: TimeCommitment;
  hoursPerWeek: number;
  gradeEligibility: string;
  deadline: string;
  postedDays: number;
  verified: boolean;
  trending: boolean;
  rating: number;
  applicants: number;
  skills: string[];
  contactEmail: string;
  requirements: string;
}

export const opportunities: Opportunity[] = [];

export const categories: Category[] = ['Medical', 'Nonprofit', 'Education', 'Business', 'STEM', 'Arts', 'Environment', 'Community'];
