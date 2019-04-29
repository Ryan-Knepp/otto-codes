import React from "react";
import Tree from "./Tree";
import "./TreeNode.css";
import * as Icons from "../icons";

const getFolderIcon = (name, isOpen) => {
  switch (name) {
    // case "src":
    //   return isOpen ? Icons.SrcFolderOpen : Icons.SrcFolder
    default:
      return isOpen ? Icons.FolderOpen : Icons.Folder;
  }
};

function TreeNode({ node, openPath }) {
  if (node.type === "folder") {
    const isOpened = openPath.length > 0 && openPath[0] === node.name;
    const Icon = getFolderIcon(node.name, isOpened);
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

  return (
    <li className="node">
      <div className="nodeDisplay">
        <Icons.File width="16px" className="icon" />
        {node.name}
      </div>
    </li>
  );
}

export default TreeNode;
