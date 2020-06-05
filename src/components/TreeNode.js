import React, { useState } from "react";
import Tree from "./Tree";
import "./TreeNode.css";
import * as Icons from "../icons";

function TreeNode({ node, onFileClick }) {
  const toggleIsOpened = useNodeToggleState(node);
  const Icon =
    node.type === "folder"
      ? Icons.getFolderIcon(node.name, node.isOpen)
      : Icons.getFileIcon(node.name);

  //show file icon
  if (node.type === "folder") {
    return (
      <li className="folder node">
        <div className="nodeDisplay" onClick={() => toggleIsOpened()}>
          {Icon && <Icon width="16px" className="icon" />}
          {node.name}
        </div>
        {node.isOpen ? (
          <Tree
            nodes={[...node.folders, ...node.files]}
            onNodeClick={onFileClick}
          />
        ) : null}
      </li>
    );
  }

  return (
    <li className={`node ${node.isOpen ? "selected" : ""}`}>
      <div className="nodeDisplay" onClick={() => onFileClick(node.path)}>
        {Icon && <Icon width="16px" className="icon" />}
        {node.name}
      </div>
    </li>
  );
}

const useNodeToggleState = node => {
  const [isOpen, setIsOpen] = useState(node.isOpen);
  const toggleNodeIsOpen = () => {
    node.isOpen = !node.isOpen;
    setIsOpen(node.isOpen);
  };
  return toggleNodeIsOpen;
};

export default TreeNode;
