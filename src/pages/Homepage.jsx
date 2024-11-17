// homepage.jsx

import React, { useState } from "react";
import CreateProjectForm from "../features/Project/CreateProject";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProjectCard";
import ProjectList from "../components/ProjectList";
import WelcomeModal from "../components/WelcomeModal";
import FloatingActionButton from "../components/FloatingActionButton";
import { useUserDetails } from "../hooks/useUserDetails";
import { useProjects } from "../hooks/useProjects";

const Homepage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const {
    userDetails,
    showWelcomeModal,
    setShowWelcomeModal,
    saveUserDetails,
    skipWelcome,
  } = useUserDetails();

  const { projects, saveProject, updateProject } = useProjects();

  const handleWelcomeSubmit = (details) => {
    saveUserDetails(details);
  };

  const handleWelcomeClose = () => {
    skipWelcome();
  };

  const handleEditDetails = () => {
    console.log("Edit Details clicked"); // Debugging
    setShowEditModal(true);
  };

  const handleEditSubmit = (details) => {
    saveUserDetails(details);
    setShowEditModal(false);
  };

  const handleProjectSubmit = (projectData) => {
    if (selectedProject) {
      updateProject(selectedProject.id, projectData);
      setSelectedProject({ ...selectedProject, ...projectData });
    } else {
      // Save new project and set it as the "most recent" project
      const newProject = saveProject(projectData);
      setSelectedProject(newProject);
    }
    setShowCreateModal(false);
  };

  const handleProjectClick = (project) => {
    // Update the selected project to show its quote on the right side
    setSelectedProject(project);
    // Remove the line to automatically open edit form:
    // setShowCreateModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowCreateModal(true); // Only open modal form when clicking "Edit Project"
  };

  // Determine which project to display on the right side in ProjectCard
  const projectToShow =
    selectedProject ||
    (projects && projects.length > 0 ? projects[projects.length - 1] : null);

  return (
    <div className="flex flex-col min-h-screen bg-[#2b314b] p-4">
      {/* Header section with title and edit details */}
      <div className="w-full mb-8">
        {/* Wrapping header content in a container with max-width and centering */}
        <div className="w-full max-w-[750px] mx-auto relative">
          <h1 className="mt-4 lg:mt-8 text-4xl font-bold text-[#FBFAFA] text-shadow-md text-center">
            SimpliQuote
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-start lg:justify-center lg:space-x-8 lg:space-y-0 w-full">
        {/* Project List */}
        <ProjectList
          projects={Array.isArray(projects) ? projects : []}
          onProjectClick={handleProjectClick}
          onCreateNew={() => {
            setSelectedProject(null);
            setShowCreateModal(true);
          }}
        />

        {/* Dynamic Project Card (Quote Display) */}
        <ProjectCard
          project={projectToShow}
          userDetails={userDetails}
          onEditProject={handleEditProject}
          onEditDetails={handleEditDetails} // Add this line
        />
      </div>

      {/* Mobile Floating Action Button */}
      <FloatingActionButton onClick={handleEditDetails} />

      {/* Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
        onSubmit={handleWelcomeSubmit}
      />

      <WelcomeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        initialData={userDetails}
        isEditing={true}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedProject(null);
        }}
      >
        <CreateProjectForm
          onCancel={() => {
            setShowCreateModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleProjectSubmit}
          userDetails={userDetails}
          initialData={selectedProject}
        />
      </Modal>
    </div>
  );
};

export default Homepage;
