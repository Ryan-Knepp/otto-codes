import React from "react";
import Tree from "./Tree";
import "./TreeNode.css";
import * as Icons from "../icons";

function TreeNode({ node, openPath }) {
  const isOpened = openPath.length > 0 && openPath[0] === node.name;
  const Icon =
    node.type === "folder"
      ? Icons.getFolderIcon(node.name, isOpened)
      : Icons.getFileIcon(node.name);

  if (node.type === "folder") {
    return (
      <li className="folder node">
        <div className="nodeDisplay">
          <Icon width="16px" className="icon" />
          {node.name}
        </div>
        {isOpened ? (
          <Tree
            nodes={[...node.folders, ...node.files]}
            openPath={openPath.slice(1)}
          />
        ) : null}
      </li>
    );
  }

  //show file icon
  return (
    <li className={`node ${isOpened ? "selected" : ""}`}>
      <div className="nodeDisplay">
        <Icon width="16px" className="icon" />
        {node.name}
      </div>
    </li>
  );
}

export default TreeNode;
