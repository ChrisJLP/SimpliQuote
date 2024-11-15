// utils/pdfGenerator.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates a PDF from the specified HTML element.
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} filename - The desired name for the generated PDF.
 */
export const generatePDF = (elementId, filename = "quote.pdf") => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with ID '${elementId}' not found.`);
    alert("Unable to find the quote content to generate PDF.");
    return;
  }

  // Use html2canvas to capture the element
  html2canvas(input, { scale: 2 })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      // Calculate dimensions to fit the A4 page
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF.");
    });
};
