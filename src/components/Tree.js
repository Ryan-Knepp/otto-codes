import React from "react";
import "./Tree.css";
import "./TreeNode";
import TreeNode from "./TreeNode";

function Tree({ nodes }) {
  return (
    <ul>
      {nodes.map(node => {
        return <TreeNode key={node.id} node={node} />;
      })}
    </ul>
  );
}

export default Tree;
