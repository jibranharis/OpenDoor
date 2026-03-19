export function generateResumeBullet(role: string, org: string, hours: number, description: string): string {
  const impacts = [
    `demonstrating measurable impact across ${hours}+ hours of dedicated service`,
    `contributing ${hours}+ hours of hands-on work to strengthen community outcomes`,
    `logging ${hours}+ hours of service while developing leadership and communication skills`,
  ];
  const impact = impacts[Math.floor(Math.random() * impacts.length)];

  const bullets = [
    `• ${role} | ${org} — ${description.split('.')[0]}, ${impact}.`,
    `• Served as ${role} at ${org}, ${description.toLowerCase().split('.')[0]}, totaling ${hours}+ service hours.`,
    `• Contributed as ${role} for ${org}, driving community impact through ${description.toLowerCase().split('.')[0]} over ${hours}+ hours.`,
  ];

  return bullets[Math.floor(Math.random() * bullets.length)];
}

export function generateCommonAppDescription(role: string, org: string, hours: number, description: string): string {
  const templates = [
    `${role}, ${org}. ${description.split('.')[0]}. ${hours}+ hrs. Developed leadership, empathy, and real-world skills in service.`,
    `Served as ${role} at ${org} for ${hours}+ hours. ${description.split('.')[0]}, strengthening my commitment to community impact.`,
    `${org} | ${role} | ${hours}+ hrs. ${description.split('.')[0]}, advancing my passion for meaningful service.`,
  ];
  const raw = templates[Math.floor(Math.random() * templates.length)];
  return raw.substring(0, 150); // Common App 150-char limit
}

export function generateImpactSummary(activities: { role: string; org: string; totalHours: number; category: string }[]): string {
  const totalHours = activities.reduce((s, a) => s + a.totalHours, 0);
  const categories = [...new Set(activities.map(a => a.category))];
  const topActivity = activities.sort((a, b) => b.totalHours - a.totalHours)[0];

  return `Over ${totalHours}+ hours of volunteer service across ${activities.length} organizations, ${topActivity?.name || 'your work'} demonstrates a deep commitment to ${categories.slice(0, 2).join(' and ')}. Your diverse portfolio of experiences positions you as a well-rounded, impact-driven applicant ready for higher education and beyond.`;
}

export function generateActivityDescription(org: string, role: string, category: string): string {
  const descriptions: Record<string, string[]> = {
    Medical: [
      `Provided direct patient support and compassionate care in a clinical setting, developing foundational healthcare communication skills.`,
      `Assisted healthcare professionals in daily patient care operations, deepening understanding of hospital systems and medical practices.`,
    ],
    Education: [
      `Facilitated individualized learning sessions with students, employing adaptive teaching strategies to improve academic outcomes.`,
      `Designed and delivered educational programming that improved student engagement and measurable learning gains.`,
    ],
    STEM: [
      `Applied technical skills to real-world problems, mentoring peers and contributing to innovation-driven projects.`,
      `Collaborated on a STEM initiative that blended technical expertise with community impact and hands-on problem solving.`,
    ],
    Nonprofit: [
      `Supported nonprofit operations through strategic volunteer work, contributing to the organization's mission and long-term sustainability.`,
      `Drove community outreach efforts and operational support for a mission-aligned nonprofit serving underrepresented populations.`,
    ],
    Business: [
      `Contributed to professional business operations, gaining experience in marketing, communication, and organizational strategy.`,
      `Supported key business functions within a purpose-driven organization, developing transferable professional skills.`,
    ],
    Arts: [
      `Channeled creativity and technical artistry to support community-based programs that make the arts accessible to all.`,
      `Delivered meaningful arts programming that fostered expression, creativity, and cultural enrichment in the community.`,
    ],
    Environment: [
      `Led environmental stewardship initiatives that advanced sustainability goals and educated the public on conservation.`,
      `Contributed to tangible environmental improvements through direct action, community education, and strategic outreach.`,
    ],
    Community: [
      `Strengthened community bonds through consistent, compassionate service that uplifted underserved populations.`,
      `Served as a trusted community resource, providing direct support and building lasting relationships across diverse groups.`,
    ],
  };

  const options = descriptions[category] || descriptions['Nonprofit'];
  return `${role} at ${org}. ${options[Math.floor(Math.random() * options.length)]}`;
}
