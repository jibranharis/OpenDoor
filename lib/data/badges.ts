export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: number; // total hours needed
  color: string;
}

export const badges: Badge[] = [
  { id: 'first-steps', name: 'First Steps', emoji: '🌱', description: 'Complete your first 10 hours', requirement: 10, color: '#10b981' },
  { id: 'rising-star', name: 'Rising Star', emoji: '⭐', description: 'Reach 25 hours of service', requirement: 25, color: '#f59e0b' },
  { id: 'community-champion', name: 'Community Champion', emoji: '🏆', description: 'Complete 50 hours of service', requirement: 50, color: '#6366f1' },
  { id: 'century', name: 'Century Club', emoji: '💯', description: 'Log 100 total volunteer hours', requirement: 100, color: '#ec4899' },
  { id: 'dedicated', name: 'Dedicated Leader', emoji: '🎖️', description: 'Reach 200 volunteer hours', requirement: 200, color: '#8b5cf6' },
  { id: 'legend', name: 'Impact Legend', emoji: '🌟', description: 'Hit an incredible 500 hours', requirement: 500, color: '#ef4444' },
];

export const categoryBadges = [
  { id: 'medical', name: 'Healthcare Hero', emoji: '🏥', category: 'Medical' },
  { id: 'stem', name: 'STEM Explorer', emoji: '🔬', category: 'STEM' },
  { id: 'education', name: 'Education Champion', emoji: '📚', category: 'Education' },
  { id: 'nonprofit', name: 'Nonprofit Warrior', emoji: '❤️', category: 'Nonprofit' },
  { id: 'environment', name: 'Earth Guardian', emoji: '🌍', category: 'Environment' },
  { id: 'arts', name: 'Creative Force', emoji: '🎨', category: 'Arts' },
  { id: 'business', name: 'Future Leader', emoji: '💼', category: 'Business' },
  { id: 'community', name: 'Community Pillar', emoji: '🤝', category: 'Community' },
];

export const milestones = [10, 25, 50, 100, 200, 500];

export function getNextMilestone(hours: number): number {
  return milestones.find(m => m > hours) || 500;
}

export function getEarnedBadges(hours: number): Badge[] {
  return badges.filter(b => hours >= b.requirement);
}
