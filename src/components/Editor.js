import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import Tabs from "./Tabs";
import Tree from "./Tree";
import { Scrollbars } from "react-custom-scrollbars";
import "./Editor.css";

import EditorController from "../controllers/EditorController";
import { getFileLanguage } from "../utils/helpers";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      openPath: "",
      fileName: "",
    };
    this.repository = [
      ...props.repoHandler.repository.folders,
      ...props.repoHandler.repository.files,
    ];
    this.editorController = new EditorController(props.repoHandler);
  }

  /**
   * Load the file from repository
   *
   * @memberof Editor
   */
  async componentDidMount() {
    const path = "src/vs/editor/editor.api.ts";
    await this.editorController.setCurrentCode(path);
    this.openToPath(path);
    this.addTabForPath(path);
  }

  openToPath(path) {
    const openPath = path.split("/").slice(0, -1);
    let currentFolder = this.repository;
    openPath.forEach((pathPiece) => {
      currentFolder = currentFolder.find((folder) => folder.name === pathPiece);
      if (currentFolder) {
        currentFolder.isOpen = true;
        currentFolder = currentFolder.folders;
      }
    });
  }

  /**
   * Checks if user can code. If so, add keyboard/mouse event handlers to fake coding
   *
   * @param {object} prevProps
   * @memberof Editor
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.canICode && this.props.canICode) {
      document.addEventListener("keydown", this.replaceCharacter);
    }
  }

  async onTreeNodeClick(path) {
    if (path.includes(".")) {
      await this.editorController.setCurrentCode(path);
      this.editorController.clearEditor();
      this.addTabForPath(path);
    }
  }

  addTabForPath(path) {
    const fileName = path.split("/").slice(-1)[0];
    let alreadInTabs = false;
    const newTabs = this.state.tabs.map((tab) => {
      if (tab.id === path) {
        alreadInTabs = true;
      }
      return {
        ...tab,
        active: tab.id === path,
      };
    });
    if (!alreadInTabs) {
      newTabs.push({ title: fileName, active: true, id: path });
    }
    this.setState({
      openPath: path,
      tabs: newTabs,
      fileName: fileName,
    });
  }

  async onTabClick(id) {
    const newTabs = this.state.tabs.map((tab) => {
      return {
        ...tab,
        active: tab.id === id,
      };
    });
    await this.editorController.setCurrentCode(id);
    this.editorController.clearEditor();
    this.openToPath(id);
    this.setState({
      openPath: id,
      tabs: newTabs,
    });
  }

  /**
   * Event handler that takes in an action and add the next few characters to the code editor
   *
   * @memberof Editor
   */
  replaceCharacter = (e) => {
    e.preventDefault();
    this.editorController.addCodeToEditor();
  };

  /**
   * Once the monaco editor has mounted, get references to the editor and monaco objects
   *
   * @memberof Editor
   */
  editorDidMount = (editor, monaco) => {
    editor.focus();
    this.editorController.setEditor(editor, monaco);
  };

  render() {
    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true,
    };

    return (
      <div className="container">
        <div className="code-explorer">
          <Scrollbars style={{ width: "100%", height: "100%" }}>
            <h2>Otto Codes</h2>
            <Tree
              nodes={this.repository}
              onNodeClick={(path) => this.onTreeNodeClick(path)}
            />
          </Scrollbars>
        </div>
        <div className="code-editor">
          <Tabs tabs={this.state.tabs} onClick={(id) => this.onTabClick(id)} />
          <MonacoEditor
            language={getFileLanguage(this.state.fileName)}
            theme="vs-dark"
            options={options}
            editorDidMount={this.editorDidMount}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
