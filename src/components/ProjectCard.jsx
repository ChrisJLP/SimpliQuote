import React from "react";
import PropTypes from "prop-types";
import QuotePreview from "../features/Project/QuotePreview";
import Button from "./Button";
import { generatePDF } from "../utils/pdfGenerator";

const ProjectCard = ({ project, userDetails, onEditProject }) => {
  if (!project) {
    return (
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-[#EFEFEC] rounded-lg shadow-md flex flex-col max-h-[600px]">
          <div className="p-4 flex-1 overflow-y-auto text-center">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              No Project Selected
            </h2>
            <p className="text-gray-600">
              When you have created or selected a project, the quote will be
              displayed here.
            </p>
          </div>
          {/* Placeholder for bottom spacing */}
          <div className="p-4">{/* Empty bottom space */}</div>
        </div>
      </div>
    );
  }

  // If there is a project, show the quote preview and actions
  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      <div className="bg-[#EFEFEC] rounded-lg shadow-md flex flex-col max-h-[900px]">
        <div className="p-4 flex-1 overflow-y-auto">
          <QuotePreview projectData={project} userDetails={userDetails} />
        </div>
        <div className="sticky bottom-0 left-0 right-0 p-4 flex justify-end space-x-4 bg-[#EFEFEC]">
          <Button
            variant="secondary"
            type="button"
            onClick={() => generatePDF(project, userDetails)}
          >
            Download as PDF
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => onEditProject(project)}
          >
            Edit Project
          </Button>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object,
  userDetails: PropTypes.object,
  onEditProject: PropTypes.func.isRequired,
};

ProjectCard.defaultProps = {
  project: null,
  userDetails: null,
};

export default ProjectCard;
