import { useState, useEffect } from "react";
import {
  profile as staticProfile,
  projects as staticProjects,
  skillCategories as staticSkillCategories,
  education as staticEducation,
} from "../data/portfolioData";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

/** Transform a Strapi v5 projects collection response into our internal shape. */
function transformProjects(data) {
  return data.map((item) => ({
    id: item.documentId ?? String(item.id),
    title: item.title,
    subtitle: item.subtitle ?? "",
    description: item.description ?? "",
    displayType: item.displayType ?? "image",
    imageUrl: item.image?.url
      ? `${STRAPI_URL}${item.image.url}`
      : item.imageUrl ?? null,
    videoUrl: item.video?.url
      ? `${STRAPI_URL}${item.video.url}`
      : item.videoUrl ?? null,
    repo: item.repo ?? null,
    tags: item.tags ?? [],
    featured: item.featured ?? false,
    wsEndpoint: item.wsEndpoint ?? null,
    terminalLabel: item.terminalLabel ?? null,
    terminalLines: item.terminalLines ?? [],
  }));
}

function transformProfile(data) {
  return {
    name: data.name,
    tagline: data.tagline,
    bio: data.bio,
    email: data.email,
    phone: data.phone,
    github: data.github,
    linkedin: data.linkedin,
    location: data.location,
    availableForCollaboration: data.availableForCollaboration ?? false,
  };
}

function transformSkillCategories(data) {
  return data.map((item) => ({
    id: item.documentId ?? String(item.id),
    title: item.title,
    skills: item.skills ?? [],
  }));
}

function transformEducation(data) {
  return data.map((item) => ({
    id: item.documentId ?? String(item.id),
    institution: item.institution,
    degree: item.degree,
    concentration: item.concentration,
    coursework: item.coursework ?? [],
    startYear: item.startYear,
    endYear: item.endYear ?? null,
    badge: item.badge ?? null,
  }));
}

/**
 * Fetches portfolio data from Strapi if VITE_STRAPI_URL is set,
 * otherwise returns the static fallback data immediately.
 */
export function usePortfolioData() {
  const [portfolioData, setPortfolioData] = useState({
    profile: staticProfile,
    projects: staticProjects,
    skillCategories: staticSkillCategories,
    education: staticEducation,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!STRAPI_URL) return;

    const controller = new AbortController();
    setLoading(true);

    Promise.all([
      fetch(`${STRAPI_URL}/api/projects?populate=*&sort=featured:desc`, {
        signal: controller.signal,
      }).then((r) => r.json()),
      fetch(`${STRAPI_URL}/api/profile?populate=*`, {
        signal: controller.signal,
      }).then((r) => r.json()),
      fetch(`${STRAPI_URL}/api/skill-categories?populate=*`, {
        signal: controller.signal,
      }).then((r) => r.json()),
      fetch(`${STRAPI_URL}/api/educations?populate=*`, {
        signal: controller.signal,
      }).then((r) => r.json()),
    ])
      .then(([projectsRes, profileRes, skillsRes, eduRes]) => {
        setPortfolioData({
          profile: transformProfile(profileRes.data),
          projects: transformProjects(projectsRes.data),
          skillCategories: transformSkillCategories(skillsRes.data),
          education: transformEducation(eduRes.data),
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Strapi unavailable, using static data:", err.message);
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { ...portfolioData, loading, error };
}
