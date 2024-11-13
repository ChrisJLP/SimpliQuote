import React from "react";
import PropTypes from "prop-types";
import { useQuoteNumber } from "../hooks/useQuoteNumber";

const QuoteNumber = ({
  shouldGenerate = false,
  existingNumber = null,
  className = "",
}) => {
  const quoteNumber = useQuoteNumber(shouldGenerate, existingNumber);

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
};

export default QuoteNumber;
