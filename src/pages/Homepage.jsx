import React, { useState } from "react";
import CreateProjectForm from "../features/Project/CreateProject";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProjectCard";
import WelcomeModal from "../components/WelcomeModal";
import FloatingActionButton from "../components/FloatingActionButton";
import ProjectList from "../components/ProjectList";
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
    setShowEditModal(true);
  };

  const handleEditSubmit = (details) => {
    saveUserDetails(details);
    setShowEditModal(false);
  };

  const handleProjectSubmit = (projectData) => {
    if (selectedProject) {
      updateProject(selectedProject.id, projectData);
      setSelectedProject(null);
    } else {
      saveProject(projectData);
    }
    setShowCreateModal(false);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowCreateModal(true);
  };

  const handleCreateNew = () => {
    setSelectedProject(null);
    setShowCreateModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#2b314b] p-4">
      {/* Header section with title and edit details */}
      <div className="w-full relative mb-8">
        <h1 className="mt-4 lg:mt-8 text-4xl font-bold text-[#FBFAFA] text-shadow-md text-center">
          SimpliQuote
        </h1>

        <button
          onClick={handleEditDetails}
          className="hidden lg:flex items-center space-x-2 px-3 py-1.5 
            text-sm text-[#FBFAFA] hover:text-white
            bg-slate-600/30 hover:bg-slate-600/50 rounded
            transition-colors duration-200
            absolute lg:mt-10 right-4 top-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Edit Your Details</span>
        </button>
      </div>

      <div className="flex flex-col items-center lg:items-stretch lg:flex-row lg:justify-center lg:space-x-8 w-full">
        <ProjectList
          projects={projects}
          onProjectClick={handleProjectClick}
          onCreateNew={handleCreateNew}
        />

        <ProjectCard
          title="Example Project"
          description="This is a placeholder for an example project."
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

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CreateProjectForm
          onCancel={() => {
            setShowCreateModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleProjectSubmit}
          userDetails={userDetails || null}
          initialData={selectedProject}
        />
      </Modal>
    </div>
  );
};

export default Homepage;
