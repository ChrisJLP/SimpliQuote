// components/ProjectList.jsx
import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const ProjectList = ({ projects, onProjectClick, onCreateNew }) => {
  return (
    <div className="mt-8 bg-[#EFEFEC] rounded-lg shadow-md p-6 w-[280px] h-[200px] flex flex-col">
      <h2 className="text-2xl font-semibold text-shadow-sm text-center">
        Projects
      </h2>

      <div className="flex-1 overflow-y-auto mt-4">
        {projects.length === 0 ? (
          <p className="text-gray-600 text-center">
            Links to future projects will display here.
          </p>
        ) : (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => onProjectClick(project)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
                >
                  {project.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto w-full">
        <Button
          variant="primary"
          onClick={onCreateNew}
          className="w-full whitespace-nowrap px-4"
        >
          Create a new project
        </Button>
      </div>
    </div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onProjectClick: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func.isRequired,
};

export default ProjectList;
