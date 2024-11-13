import { useState, useEffect } from "react";

const QUOTE_NUMBER_KEY = "lastQuoteNumber";
const CURRENT_QUOTE_KEY = "currentQuoteNumber";

export const useQuoteNumber = () => {
  const [quoteNumber, setQuoteNumber] = useState(null);

  useEffect(() => {
    // Check if we already have a number for this quote view
    const currentNumber = sessionStorage.getItem(CURRENT_QUOTE_KEY);

    if (currentNumber) {
      // If we already have a number for this quote, use it
      setQuoteNumber(currentNumber);
    } else {
      // Get the last quote number from localStorage
      const lastNumber = localStorage.getItem(QUOTE_NUMBER_KEY) || "0";
      const nextNumber = (parseInt(lastNumber) + 1).toString();

      // Save the new number as both the last number and current number
      localStorage.setItem(QUOTE_NUMBER_KEY, nextNumber);
      sessionStorage.setItem(CURRENT_QUOTE_KEY, nextNumber);
      setQuoteNumber(nextNumber);
    }
  }, []); // Only run once when component mounts

  // Format the quote number with leading zeros (e.g., "001")
  const formattedQuoteNumber = quoteNumber ? quoteNumber.padStart(3, "0") : "";

  return formattedQuoteNumber;
};

// Add a helper function to clear the current quote number
// This should be called when creating a new project
export const clearCurrentQuoteNumber = () => {
  sessionStorage.removeItem(CURRENT_QUOTE_KEY);
};
