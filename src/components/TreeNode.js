import React from "react";
import "./TreeNode.css";
import Tree from "./Tree";

function TreeNode({ node, openPath }) {
  if (node.type === "folder") {
    const isOpened = openPath.length > 0 && openPath[0] === node.name;
    openPath.shift();
    return (
      <li className="folder node">
        {node.name}
        {isOpened ? (
          <Tree nodes={[...node.folders, ...node.files]} openPath={openPath} />
        ) : null}
      </li>
    );
  }

  return <li className="node">{node.name}</li>;
}

export default TreeNode;
