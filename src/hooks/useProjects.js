// hooks/useProjects.js
import { useState, useEffect } from "react";
import { getCurrentQuoteNumber } from "./useQuoteNumber";
import { storage } from "../utils/storage";

const STORAGE_KEY = "projects";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved projects on mount
    const savedProjects = storage.load(STORAGE_KEY, []);
    if (savedProjects) {
      setProjects(savedProjects);
    }
  }, []);

  const saveProject = (projectData) => {
    try {
      const newProject = {
        ...projectData,
        id: Date.now(),
        quoteNumber: getCurrentQuoteNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProjects = [...projects, newProject];
      const success = storage.save(STORAGE_KEY, updatedProjects);

      if (!success) {
        throw new Error("Failed to save project");
      }

      setProjects(updatedProjects);
      setError(null);
      return newProject;
    } catch (err) {
      setError("Failed to save project. Please try again.");
      console.error("Error saving project:", err);
      return null;
    }
  };

  const updateProject = (id, projectData) => {
    try {
      const updatedProjects = projects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...projectData,
              quoteNumber: project.quoteNumber,
              createdAt: project.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : project
      );

      const success = storage.save(STORAGE_KEY, updatedProjects);

      if (!success) {
        throw new Error("Failed to update project");
      }

      setProjects(updatedProjects);
      setError(null);
    } catch (err) {
      setError("Failed to update project. Please try again.");
      console.error("Error updating project:", err);
    }
  };

  const deleteProject = (id) => {
    try {
      const updatedProjects = projects.filter((project) => project.id !== id);
      const success = storage.save(STORAGE_KEY, updatedProjects);

      if (!success) {
        throw new Error("Failed to delete project");
      }

      setProjects(updatedProjects);
      setError(null);
    } catch (err) {
      setError("Failed to delete project. Please try again.");
      console.error("Error deleting project:", err);
    }
  };

  const getProject = (id) => {
    return projects.find((project) => project.id === id);
  };

  return {
    projects,
    saveProject,
    updateProject,
    deleteProject,
    getProject,
    error,
  };
};
