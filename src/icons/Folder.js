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
      d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1.11-.9-2-2-2h-8l-2-2z"
      fill={fill}
    />
  </svg>
);

export default Icon;
