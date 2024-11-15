// src/utils/pdfGenerator.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates a PDF from the specified HTML element.
 * Handles multi-page content by splitting the captured image across multiple PDF pages.
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} filename - The desired name for the generated PDF.
 */
export const generatePDF = async (elementId, filename = "quote.pdf") => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with ID '${elementId}' not found.`);
    alert("Unable to find the quote content to generate PDF.");
    return;
  }

  try {
    // Clone the element to modify styles without affecting the original
    const clonedElement = originalElement.cloneNode(true);
    clonedElement.style.maxHeight = "none"; // Remove height constraints
    clonedElement.style.overflow = "visible"; // Ensure all content is visible

    // Append the cloned element to the body (hidden)
    clonedElement.style.position = "absolute";
    clonedElement.style.left = "-9999px";
    clonedElement.style.top = "0";
    document.body.appendChild(clonedElement);

    // Use html2canvas to capture the cloned element
    const canvas = await html2canvas(clonedElement, { scale: 2 });

    // Remove the cloned element after capturing
    document.body.removeChild(clonedElement);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "px", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the number of pages
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / pdfWidth;
    const imgPDFHeight = imgHeight / ratio;

    let heightLeft = imgPDFHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgPDFHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if necessary
    while (heightLeft > 0) {
      position = heightLeft - imgPDFHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgPDFHeight);
      heightLeft -= pdfHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating the PDF. Please try again.");
  }
};
