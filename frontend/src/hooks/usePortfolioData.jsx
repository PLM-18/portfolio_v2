import {
  profile,
  projects,
  skillCategories,
  education,
  certifications,
} from "../data/portfolioData";

export function usePortfolioData() {
  return { profile, projects, skillCategories, education, certifications, loading: false, error: null };
}
