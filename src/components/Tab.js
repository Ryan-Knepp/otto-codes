import React from "react";
import "./Tab.css";
import JSFile from "../icons/JSFile";

const Tab = props => {
  const className = props.active ? "tab tab-active" : "tab";
  return (
    <li onClick={() => props.onClick(props.id)} className={className}>
      <JSFile width="16px" className="icon" />
      {props.children}
    </li>
  );
};

export default Tab;
