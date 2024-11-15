// components/QuotePreview.jsx
import React from "react";
import PropTypes from "prop-types";
import { calculateTotalHours } from "../../utils/calculateCost";

const QuotePreview = ({ projectData, userDetails }) => {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Use the quote number passed down from projectData
  const quoteNumber = projectData.quoteNumber || "N/A";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-8">
        {/* Header */}
        <div className="space-y-6 sm:space-y-0 sm:flex sm:justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Quote</h1>
            <div className="space-y-1">
              <p className="text-gray-600">Date: {currentDate}</p>
              <p className="text-gray-600">Quote #: {quoteNumber}</p>
            </div>
          </div>
          {userDetails && (
            <div className="text-left sm:text-right space-y-1 mt-4 sm:mt-0">
              <p className="font-bold">
                {userDetails.companyName || "Company Name"}
              </p>
              <p>{userDetails.name || "Your Name"}</p>
              <p>{userDetails.email || "Email"}</p>
              <p>{userDetails.phoneNumber || "Phone"}</p>
            </div>
          )}
        </div>

        {/* Client Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Quote For:</h2>
          <p>{projectData.customerName || "Customer"}</p>
        </div>

        {/* Project Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Project: {projectData.name}
          </h2>

          {/* Simple project without tasks */}
          {(!projectData.tasks || projectData.tasks.length === 0) && (
            <div className="space-y-2 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Hours:</span>
                <span>{projectData.hoursEstimate}h</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Rate:</span>
                <span>{formatCurrency(projectData.hourlyRate)}/hour</span>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {projectData.tasks && projectData.tasks.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <table className="w-full mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Task</th>
                    <th className="px-4 py-2 text-right">Hours</th>
                    <th className="px-4 py-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projectData.tasks.map((task, index) => (
                    <React.Fragment key={index}>
                      <tr className="bg-white">
                        <td className="px-4 py-2 font-medium">{task.name}</td>
                        <td className="px-4 py-2 text-right">
                          {task.subtasks?.length > 0
                            ? calculateTotalHours([task])
                            : task.hoursEstimate}
                          h
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(
                            calculateTotalHours([task]) * projectData.hourlyRate
                          )}
                        </td>
                      </tr>
                      {/* Display subtasks */}
                      {task.subtasks?.map((subtask, idx) => (
                        <tr
                          key={`${index}-${idx}`}
                          className="bg-gray-50 text-sm"
                        >
                          <td className="px-4 py-2 pl-8">- {subtask.name}</td>
                          <td className="px-4 py-2 text-right">
                            {subtask.hoursEstimate}h
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(
                              subtask.hoursEstimate * projectData.hourlyRate
                            )}
                          </td>
                        </tr>
                      ))}
                      {/* Display task otherCosts */}
                      {task.otherCosts?.length > 0 && (
                        <tr className="bg-gray-50 text-sm">
                          <td className="px-4 py-2 pl-8 italic font-medium">
                            Other Costs for "{task.name}":
                          </td>
                          <td />
                          <td />
                        </tr>
                      )}
                      {task.otherCosts?.map((cost, cIdx) => (
                        <tr
                          key={`task-cost-${index}-${cIdx}`}
                          className="bg-gray-50 text-sm"
                        >
                          <td className="px-4 py-2 pl-12">· {cost.name}</td>
                          <td className="px-4 py-2 text-right">-</td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(cost.amount)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Additional Costs Section (Project-level) */}
          {projectData.otherCosts && projectData.otherCosts.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <h3 className="text-md font-semibold mb-2">Additional Costs</h3>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projectData.otherCosts.map((cost, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-4 py-2">{cost.name}</td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(cost.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total Section */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Quote Amount:</span>
              <span>{formatCurrency(projectData.totalCost)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-8 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
          <div className="whitespace-pre-line">
            {userDetails?.terms ||
              `This quote is valid for 30 days from the date of issue.
Payment terms: 50% deposit required to commence work.
Final payment due upon project completion.`}
          </div>
        </div>
      </div>
    </div>
  );
};

QuotePreview.propTypes = {
  projectData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    hourlyRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    hoursEstimate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        hoursEstimate: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        subtasks: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            hoursEstimate: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
            ]).isRequired,
          })
        ),
        otherCosts: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
          })
        ),
      })
    ),
    otherCosts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ),
    totalCost: PropTypes.number.isRequired,
    quoteNumber: PropTypes.string, // Ensure this property is recognized
  }).isRequired,
  userDetails: PropTypes.shape({
    companyName: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
};

export default QuotePreview;
