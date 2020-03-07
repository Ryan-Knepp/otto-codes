import React from "react";
import "./Tree.css";
import TreeNode from "./TreeNode";

function Tree({ nodes, onNodeClick }) {
  return (
    <ul className="folderContainer">
      {nodes.map(node => {
        return (
          <TreeNode key={node.path} node={node} onFileClick={onNodeClick} />
        );
      })}
    </ul>
  );
}

export default Tree;
