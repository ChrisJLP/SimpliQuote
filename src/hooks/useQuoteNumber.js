// hooks/useQuoteNumber.js
import { useState, useEffect } from "react";

const QUOTE_NUMBER_KEY = "lastQuoteNumber";
const CURRENT_QUOTE_KEY = "currentQuoteNumber";

export const useQuoteNumber = (
  shouldGenerate = true,
  existingNumber = null
) => {
  const [quoteNumber, setQuoteNumber] = useState(null);

  useEffect(() => {
    // Clear any existing quote number in session storage when mounting
    sessionStorage.removeItem(CURRENT_QUOTE_KEY);

    // If we have an existing number, use it
    if (existingNumber) {
      setQuoteNumber(existingNumber);
      return;
    }

    // Only generate a new number if shouldGenerate is true and we don't have an existing number
    if (shouldGenerate && !existingNumber) {
      const lastNumber = localStorage.getItem(QUOTE_NUMBER_KEY) || "0";
      const nextNumber = (parseInt(lastNumber) + 1).toString();
      localStorage.setItem(QUOTE_NUMBER_KEY, nextNumber);
      setQuoteNumber(nextNumber);
    }
  }, [existingNumber, shouldGenerate]); // Dependencies for useEffect

  // Format the quote number with leading zeros (e.g., "001")
  const formattedQuoteNumber = quoteNumber ? quoteNumber.padStart(3, "0") : "";

  return formattedQuoteNumber;
};

// This function is used when creating a new project
export const getCurrentQuoteNumber = () => {
  return localStorage.getItem(QUOTE_NUMBER_KEY);
};

// We don't need this anymore since we're managing the clear in the hook
export const clearCurrentQuoteNumber = () => {
  sessionStorage.removeItem(CURRENT_QUOTE_KEY);
};
