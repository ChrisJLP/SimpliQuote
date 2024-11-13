// hooks/useProjects.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "simpliquote_projects";

export const useProjects = () => {
  const [projects, setProjects] = useState([]); // Initialize with empty array

  useEffect(() => {
    try {
      const savedProjectsString = localStorage.getItem(STORAGE_KEY);
      if (savedProjectsString) {
        const savedProjects = JSON.parse(savedProjectsString);
        // Ensure we're setting an array
        setProjects(Array.isArray(savedProjects) ? savedProjects : []);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]); // Fallback to empty array on error
    }
  }, []);

  const saveProject = (projectData) => {
    try {
      const newProject = {
        ...projectData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProjects((prevProjects) => {
        const updatedProjects = [...prevProjects, newProject];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
        return updatedProjects;
      });

      return newProject;
    } catch (error) {
      console.error("Error saving project:", error);
      return null;
    }
  };

  const updateProject = (id, projectData) => {
    try {
      setProjects((prevProjects) => {
        const updatedProjects = prevProjects.map((project) =>
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
        return updatedProjects;
      });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = (id) => {
    try {
      setProjects((prevProjects) => {
        const updatedProjects = prevProjects.filter(
          (project) => project.id !== id
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
        return updatedProjects;
      });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getProject = (id) => {
    return projects.find((project) => project.id === id);
  };

  return {
    projects: projects || [], // Ensure we always return an array
    saveProject,
    updateProject,
    deleteProject,
    getProject,
  };
};
