// src/pages/Homepage.jsx

import React, { useState, useEffect } from "react";
import CreateProjectForm from "../features/Project/CreateProject";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProjectCard";
import ProjectList from "../components/ProjectList";
import WelcomeModal from "../components/WelcomeModal";
import FloatingActionButton from "../components/FloatingActionButton";
import { useUserDetails } from "../hooks/useUserDetails";
import { useProjects } from "../hooks/useProjects";
import QuotePreview from "../features/Project/QuotePreview"; // Ensure QuotePreview is imported

// Define a constant for the example project ID to avoid magic numbers
const EXAMPLE_PROJECT_ID = -1;

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

  const { projects, saveProject, updateProject, deleteProject } = useProjects();

  // Define the example project with placeholder data
  const exampleProject = {
    id: EXAMPLE_PROJECT_ID, // Use the defined constant
    name: "Example Project",
    customerName: "Customer name",
    hourlyRate: 0, // Set to 0 to prevent NaN in calculations
    tasks: [
      {
        name: "Your tasks will show here",
        subtasks: [
          {
            name: "This is a subtask",
            hoursEstimate: 0, // Set to 0
            otherCosts: [
              {
                name: "This is a task cost",
                amount: 0, // Set to 0
                category: "Placeholder Category",
              },
            ],
          },
        ],
        otherCosts: [],
      },
    ],
    otherCosts: [
      {
        name: "This is a project cost",
        amount: 0, // Set to 0
        category: "Placeholder Category",
      },
    ],
    totalCost: 0, // Initialize to 0
    quoteNumber: "EXAMPLE",
    updatedAt: new Date().toISOString(), // Ensure updatedAt is present
  };

  // Function to load the example project
  const loadExampleProject = () => {
    // Check if the example project already exists to avoid duplicates
    const exists = projects.some(
      (project) => project.id === EXAMPLE_PROJECT_ID
    );
    if (!exists) {
      saveProject(exampleProject);
    }
    // Select the example project
    const project =
      projects.find((proj) => proj.id === EXAMPLE_PROJECT_ID) || exampleProject;
    setSelectedProject(project);
  };

  useEffect(() => {
    // On initial load, if there are no projects, load the example project
    if (projects.length === 0) {
      loadExampleProject();
    } else {
      // Optionally, select the first project or handle as per your logic
      setSelectedProject(projects[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const handleWelcomeSubmit = (details) => {
    saveUserDetails(details);
  };

  const handleWelcomeClose = () => {
    skipWelcome();
    if (projects.length === 0) {
      loadExampleProject();
    }
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
    if (selectedProject && selectedProject.id !== EXAMPLE_PROJECT_ID) {
      // Update existing project
      updateProject(selectedProject.id, projectData);
      setSelectedProject({ ...selectedProject, ...projectData });
    } else if (selectedProject && selectedProject.id === EXAMPLE_PROJECT_ID) {
      // Update the example project instead of creating a new one
      updateProject(selectedProject.id, projectData);
      setSelectedProject({ ...selectedProject, ...projectData });
    } else {
      // Save new project and set it as the "most recent" project
      const newProject = saveProject(projectData);
      setSelectedProject(newProject);
      // Delete the example project if it exists
      deleteProject(EXAMPLE_PROJECT_ID);
    }
    setShowCreateModal(false);
  };

  const handleProjectClick = (project) => {
    // Update the selected project to show its quote on the right side
    setSelectedProject(project);
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
      {/* Header section with title */}
      <div className="w-full mb-8 flex justify-between items-center">
        {/* Wrapping header content in a container with max-width and centering */}
        <div className="max-w-[750px] mx-auto relative">
          <h1 className="mt-4 lg:mt-8 text-4xl font-bold text-[#FBFAFA] text-shadow-md text-center">
            SimpliQuote
          </h1>
        </div>

        {/* Remove User Details from Homepage Header */}
        {/*
        <div className="absolute right-4 top-4 lg:relative lg:top-auto lg:right-auto lg:flex lg:items-center lg:space-x-2">
          {userDetails ? (
            <div className="text-right">
              <p className="text-sm text-[#FBFAFA]">{userDetails.name}</p>
              <p className="text-xs text-[#FBFAFA]">{userDetails.email}</p>
              <p className="text-xs text-[#FBFAFA]">
                {userDetails.phoneNumber}
              </p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-sm text-gray-300">
                Your details will show here
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditDetails();
                }}
                className="text-blue-400 text-xs hover:underline"
              >
                Update Details
              </a>
            </div>
          )}
        </div>
        */}
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
          onEditDetails={handleEditDetails} // Ensure this prop is passed
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
