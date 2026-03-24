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

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Hospital Volunteer Assistant',
    organization: 'City Medical Center',
    description: 'Assist nursing staff with non-medical tasks, help patients find their way, and provide comfort and support in the waiting area.',
    category: 'Medical',
    location: 'Chicago, IL',
    locationType: 'In-Person',
    timeCommitment: 'Weekly',
    hoursPerWeek: 4,
    gradeEligibility: '10-12',
    deadline: '2024-06-01',
    postedDays: 2,
    verified: true,
    trending: true,
    rating: 4.8,
    applicants: 12,
    skills: ['Compassion', 'Communication', 'Organization'],
    contactEmail: 'volunteers@citymedical.org',
    requirements: 'Must be 16+, background check required, 6-month commitment.'
  },
  {
    id: '2',
    title: 'STEM Tutor for Middle Schoolers',
    organization: 'Youth Innovators',
    description: 'Help 6th-8th grade students with math and science homework. Share your passion for STEM and inspire the next generation.',
    category: 'STEM',
    location: 'Remote',
    locationType: 'Remote',
    timeCommitment: 'Weekly',
    hoursPerWeek: 2,
    gradeEligibility: '9-12',
    deadline: '2024-05-15',
    postedDays: 1,
    verified: true,
    trending: false,
    rating: 4.5,
    applicants: 8,
    skills: ['Teaching', 'Mathematics', 'Science'],
    contactEmail: 'programs@youthinnovators.org',
    requirements: 'Strong academic record in STEM subjects, patience and reliability.'
  },
  {
    id: '3',
    title: 'Community Garden Coordinator',
    organization: 'Green Earth Alliance',
    description: 'Help maintain our local community garden. Tasks include planting, weeding, harvesting, and organizing community work days.',
    category: 'Environment',
    location: 'Chicago, IL',
    locationType: 'In-Person',
    timeCommitment: 'Flexible',
    hoursPerWeek: 3,
    gradeEligibility: '9-12',
    deadline: '2024-04-30',
    postedDays: 5,
    verified: true,
    trending: true,
    rating: 4.9,
    applicants: 5,
    skills: ['Gardening', 'Leadership', 'Teamwork'],
    contactEmail: 'info@greenearth.org',
    requirements: 'Interest in sustainability, ability to work outdoors.'
  }
];

export const categories: Category[] = ['Medical', 'Nonprofit', 'Education', 'Business', 'STEM', 'Arts', 'Environment', 'Community'];
