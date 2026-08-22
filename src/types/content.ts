export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  period: string;
  bullets: string[];
  pipeline: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  period: string;
  stack: string[];
  highlights: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  resumeHref: string;
}
