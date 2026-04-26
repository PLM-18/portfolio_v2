import {
  profile,
  projects,
  skillCategories,
  education,
} from "../data/portfolioData";

export function usePortfolioData() {
  return { profile, projects, skillCategories, education, loading: false, error: null };
}
