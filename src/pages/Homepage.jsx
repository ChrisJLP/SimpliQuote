import React, { useState } from "react"; // Add useState import
import CreateProjectForm from "../features/Project/CreateProject"; // Add this import

const Homepage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false); // Add this state

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#2b314b] p-4">
      <h1 className="mt-4 lg:mt-8 text-4xl font-bold text-[#FBFAFA] text-shadow-md">
        SimpliQuote
      </h1>

      {/* Wrapper div for side-by-side layout */}
      <div className="flex flex-col items-center lg:items-stretch lg:flex-row lg:justify-center lg:space-x-8 w-full lg:mt-16">
        {/* Projects Section */}
        <section
          className="
            flex flex-col items-center mt-8 bg-[#EFEFEC] rounded-lg shadow-md p-6 
            w-[75vw] min-h-[20vh] max-w-[60vh] max-h-[30vh] 
            md:w-[50vh] md:min-h-[30vh] md:max-w-[30vh] md:max-h-[60vh]
            lg:w-[30vh] lg:min-h-[20vh] lg:max-w-[30vh] lg:max-h-[20vh]
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-shadow-sm">Projects</h2>
          </div>

          <p className="text-gray-600 text-center">
            Links to future projects will display here.
          </p>

          {/* Update the button with onClick handler */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-8 font-bold bg-[#4CAF50] text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-[#45A049]"
          >
            Create a new project
          </button>
        </section>

        {/* Project Box */}
        <div
          className="mt-8 bg-[#EFEFEC] rounded-lg shadow-md p-6 
            w-[75vw] h-[60vh] max-w-[60vh] max-h-[60vh] 
            md:w-[50vh] md:h-[60vh]
            lg:w-[50vh] lg:h-[60vh]
            lg:mt-8
            overflow-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-shadow-sm">
            Example Project
          </h2>
          <p className="text-gray-700 text-center">
            This is a placeholder for an example project.
          </p>
        </div>
      </div>

      {/* Add the modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CreateProjectForm
            onCancel={() => setShowCreateModal(false)}
            onSubmit={(data) => {
              console.log("Project data:", data);
              setShowCreateModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Homepage;
