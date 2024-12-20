// components/QuoteNumber.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useQuoteNumber } from "../hooks/useQuoteNumber";

const QuoteNumber = ({
  shouldGenerate = false,
  existingNumber = null,
  className = "",
  onGenerate,
}) => {
  const quoteNumber = useQuoteNumber(shouldGenerate, existingNumber);

  useEffect(() => {
    if (quoteNumber && onGenerate && !existingNumber) {
      onGenerate(quoteNumber);
    }
  }, [quoteNumber, onGenerate, existingNumber]);

  if (!quoteNumber) return null;

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Quote #: {quoteNumber}
    </div>
  );
};

QuoteNumber.propTypes = {
  shouldGenerate: PropTypes.bool,
  existingNumber: PropTypes.string,
  className: PropTypes.string,
  onGenerate: PropTypes.func,
};

export default QuoteNumber;
