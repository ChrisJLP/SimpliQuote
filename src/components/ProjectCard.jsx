// components/ProjectCard.jsx
const ProjectCard = ({ title, description }) => {
  return (
    <div
      className="mt-8 bg-[#EFEFEC] rounded-lg shadow-md p-6 
          w-[75vw] h-[60vh] max-w-[60vh] max-h-[60vh] 
          md:w-[50vh] md:h-[60vh]
          lg:w-[50vh] lg:h-[60vh]
          lg:mt-8
          overflow-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-shadow-sm">
        {title}
      </h2>
      <p className="text-gray-700 text-center">{description}</p>
    </div>
  );
};

export default ProjectCard;
