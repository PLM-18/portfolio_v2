import {
  profile,
  projects,
  skillCategories,
  education,
} from "../data/portfolioData";

/** Returns static portfolio data. */
export function usePortfolioData() {
  return { profile, projects, skillCategories, education, loading: false, error: null };
}
