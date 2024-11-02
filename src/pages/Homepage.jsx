import React, { useState } from "react";
import CreateProjectForm from "../features/Project/CreateProject";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProjectCard";

const Homepage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#2b314b] p-4">
      <h1 className="mt-4 lg:mt-8 text-4xl font-bold text-[#FBFAFA] text-shadow-md">
        SimpliQuote
      </h1>

      <div className="flex flex-col items-center lg:items-stretch lg:flex-row lg:justify-center lg:space-x-8 w-full lg:mt-16">
        {/* Projects Section */}
        <div
          className="mt-8 bg-[#EFEFEC] rounded-lg shadow-md p-6 
            w-[280px] h-[200px]
            flex flex-col items-center"
        >
          <h2 className="text-2xl font-semibold text-shadow-sm">Projects</h2>

          <p className="text-gray-600 text-center mt-4">
            Links to future projects will display here.
          </p>

          <div className="mt-auto w-full">
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="w-full whitespace-nowrap px-4"
            >
              Create a new project
            </Button>
          </div>
        </div>

        <ProjectCard
          title="Example Project"
          description="This is a placeholder for an example project."
        />
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CreateProjectForm
          onCancel={() => setShowCreateModal(false)}
          onSubmit={(data) => {
            console.log("Project data:", data);
            setShowCreateModal(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Homepage;
