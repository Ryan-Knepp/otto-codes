import React from "react";
import "./TreeNode.css";

function TreeNode({ node }) {
  return <li className="folder node">{node.name}</li>;
}

export default TreeNode;
