// components/ProjectList.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { ChevronDown, ChevronUp } from "lucide-react";

const INITIAL_PROJECT_COUNT = 5;
const MAX_PROJECT_COUNT = 6; // Maximum number of projects before enabling scroll
const PROJECT_ITEM_HEIGHT = 40; // Height of each project item in pixels
const HEADER_HEIGHT = 40; // Approximate height for the header
const BUTTON_HEIGHT = 40; // Height for the "Create a new project" button
const GAP_HEIGHT = 20; // Space between header and list, and list and button
const SHOW_MORE_BUTTON_HEIGHT = 30; // Height for "Show more/less" button
const EMPTY_STATE_HEIGHT = 80; // Height when no projects are present

const ProjectList = ({ projects, onProjectClick, onCreateNew }) => {
  const [showAll, setShowAll] = useState(false);

  // Sort projects by updatedAt in descending order
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Determine how many projects to display
  const displayedCount = showAll
    ? sortedProjects.length
    : INITIAL_PROJECT_COUNT;
  const projectsToDisplay = showAll
    ? sortedProjects
    : sortedProjects.slice(0, INITIAL_PROJECT_COUNT);
  const hasMore = sortedProjects.length > INITIAL_PROJECT_COUNT;

  // Calculate the height needed for the projects list
  const projectsListHeight =
    Math.min(displayedCount, MAX_PROJECT_COUNT) * PROJECT_ITEM_HEIGHT;

  // Determine if "Show more" button is needed
  const showMoreButtonHeight = hasMore ? SHOW_MORE_BUTTON_HEIGHT : 0;

  // Calculate total height
  const calculatedHeight =
    HEADER_HEIGHT +
    GAP_HEIGHT +
    projectsListHeight +
    showMoreButtonHeight +
    BUTTON_HEIGHT;

  // Define maxHeight
  const maxHeight =
    HEADER_HEIGHT +
    GAP_HEIGHT +
    MAX_PROJECT_COUNT * PROJECT_ITEM_HEIGHT +
    SHOW_MORE_BUTTON_HEIGHT +
    BUTTON_HEIGHT;

  // Define minHeight
  const minHeight =
    HEADER_HEIGHT +
    GAP_HEIGHT +
    BUTTON_HEIGHT +
    (projects.length === 0 ? EMPTY_STATE_HEIGHT : PROJECT_ITEM_HEIGHT);

  return (
    <div
      className="mt-8 bg-[#EFEFEC] rounded-lg shadow-md p-6 w-[280px] flex flex-col"
      style={{
        minHeight: `${minHeight}px`,
        height: `${Math.min(calculatedHeight, maxHeight)}px`,
        maxHeight: `${maxHeight}px`,
      }}
    >
      {/* Header */}
      <h2 className="text-2xl font-semibold text-center">Projects</h2>

      {/* Projects List Container */}
      <div
        className="mt-4 mb-4 overflow-y-auto"
        style={{
          height: `${projectsListHeight}px`,
        }}
      >
        {projects.length === 0 ? (
          // Empty State
          <p className="text-gray-600 text-center">
            Links to future projects will display here.
          </p>
        ) : (
          <>
            {/* Projects List */}
            <ul className="space-y-1">
              {projectsToDisplay.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => onProjectClick(project)}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between group text-sm h-[40px]"
                  >
                    <span className="truncate flex-1">{project.name}</span>
                    <span className="text-gray-400 text-xs hidden group-hover:inline ml-2">
                      #{project.quoteNumber}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Show More / Show Less Button */}
            {hasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-2 text-xs text-slate-600 hover:text-slate-800 flex items-center justify-center gap-1"
                style={{
                  height: `${SHOW_MORE_BUTTON_HEIGHT}px`,
                }}
              >
                {showAll ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show more ({projects.length - INITIAL_PROJECT_COUNT} more)
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* "Create a new project" Button */}
      <Button
        variant="primary"
        onClick={onCreateNew}
        className="w-full h-[40px] whitespace-nowrap px-4"
      >
        Create a new project
      </Button>
    </div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quoteNumber: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onProjectClick: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func.isRequired,
};

export default ProjectList;
