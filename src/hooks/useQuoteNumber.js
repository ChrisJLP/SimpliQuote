// hooks/useQuoteNumber.js
import { useState, useEffect, useRef } from "react";

const QUOTE_NUMBER_KEY = "lastQuoteNumber";

export const useQuoteNumber = (
  shouldGenerate = true,
  existingNumber = null
) => {
  const [quoteNumber, setQuoteNumber] = useState(null);
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    // If we already generated a number in this render cycle, don't do it again
    if (hasGeneratedRef.current) {
      return;
    }

    if (existingNumber) {
      setQuoteNumber(existingNumber);
      return;
    }

    if (shouldGenerate) {
      // Get the last used number, defaulting to 0 if none exists
      const lastUsedNumber = localStorage.getItem(QUOTE_NUMBER_KEY);
      const currentNumber = lastUsedNumber ? parseInt(lastUsedNumber, 10) : 0;
      const nextNumber = currentNumber + 1;

      // Save the number and set it as current
      localStorage.setItem(QUOTE_NUMBER_KEY, nextNumber.toString());
      setQuoteNumber(nextNumber.toString());

      // Mark that we've generated a number
      hasGeneratedRef.current = true;
    }
  }, [existingNumber, shouldGenerate]);

  // Format the quote number with leading zeros (e.g., "001")
  const formattedQuoteNumber = quoteNumber ? quoteNumber.padStart(3, "0") : "";
  return formattedQuoteNumber;
};
