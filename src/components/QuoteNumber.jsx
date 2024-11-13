import React from "react";
import { useQuoteNumber } from "../hooks/useQuoteNumber";

const QuoteNumber = ({ shouldGenerate = false, className = "" }) => {
  const quoteNumber = useQuoteNumber(shouldGenerate);

  if (!quoteNumber) return null;

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Quote #: {quoteNumber}
    </div>
  );
};

export default QuoteNumber;
