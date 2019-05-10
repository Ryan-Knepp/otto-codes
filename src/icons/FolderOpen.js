import React from "react";

const Icon = ({
  style = {},
  fill = "#4caf50",
  width = "100%",
  className = ""
}) => (
  <svg
    version="1.1"
    style={style}
    className={className}
    width={width}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 20H4c-1.11 0-2-.9-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z"
      fill={fill}
    />
  </svg>
);

export default Icon;
