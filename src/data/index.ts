import {
  caseStudiesSchema,
  educationSchema,
  engagementsSchema,
  experienceSchema,
  leadershipSchema,
  profileSchema,
  skillsSchema,
  type CaseStudies,
  type Education,
  type Engagements,
  type Experience,
  type Leadership,
  type Profile,
  type Skills,
} from './schema';

import caseStudiesJson from './case-studies.json';
import educationJson from './education.json';
import engagementsJson from './engagements.json';
import experienceJson from './experience.json';
import leadershipJson from './leadership.json';
import profileJson from './profile.json';
import skillsJson from './skills.json';

export const profile: Profile = profileSchema.parse(profileJson);
export const experience: Experience = experienceSchema.parse(experienceJson);
export const caseStudies: CaseStudies = caseStudiesSchema.parse(caseStudiesJson);
export const engagements: Engagements = engagementsSchema.parse(engagementsJson);
export const skills: Skills = skillsSchema.parse(skillsJson);
export const education: Education = educationSchema.parse(educationJson);
export const leadership: Leadership = leadershipSchema.parse(leadershipJson);

export type { CaseStudies, Education, Engagements, Experience, Leadership, Profile, Skills };
