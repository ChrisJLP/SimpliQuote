import { useState, useEffect } from "react";

const QUOTE_NUMBER_KEY = "lastQuoteNumber";
const CURRENT_QUOTE_KEY = "currentQuoteNumber";

export const useQuoteNumber = (shouldGenerate = true) => {
  const [quoteNumber, setQuoteNumber] = useState(null);

  useEffect(() => {
    // Check if we already have a number for this quote view
    const currentNumber = sessionStorage.getItem(CURRENT_QUOTE_KEY);

    if (currentNumber) {
      // If we already have a number for this quote, use it
      setQuoteNumber(currentNumber);
    } else if (shouldGenerate) {
      // Only generate a new number if shouldGenerate is true
      const lastNumber = localStorage.getItem(QUOTE_NUMBER_KEY) || "0";
      const nextNumber = (parseInt(lastNumber) + 1).toString();

      localStorage.setItem(QUOTE_NUMBER_KEY, nextNumber);
      sessionStorage.setItem(CURRENT_QUOTE_KEY, nextNumber);
      setQuoteNumber(nextNumber);
    }
  }, []); // Only run once when component mounts

  // Format the quote number with leading zeros (e.g., "001")
  const formattedQuoteNumber = quoteNumber ? quoteNumber.padStart(3, "0") : "";

  return formattedQuoteNumber;
};

export const getCurrentQuoteNumber = () => {
  return sessionStorage.getItem(CURRENT_QUOTE_KEY);
};

export const clearCurrentQuoteNumber = () => {
  sessionStorage.removeItem(CURRENT_QUOTE_KEY);
};
