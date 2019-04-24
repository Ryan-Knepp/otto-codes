import React from "react";
import "./Tab.css";

const Tab = props => {
  const className = props.active ? "tab tab-active" : "tab";
  return (
    <li onClick={() => props.onClick(props.id)} className={className}>
      {props.children}
    </li>
  );
};

export default Tab;
