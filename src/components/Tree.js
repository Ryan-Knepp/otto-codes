import React from "react";
import "./Tree.css";
import "./TreeNode";
import TreeNode from "./TreeNode";

function Tree({ nodes, openPath }) {
  return (
    <ul className="folderContainer">
      {nodes.map(node => {
        return <TreeNode key={node.path} node={node} openPath={openPath} />;
      })}
    </ul>
  );
}

export default Tree;
