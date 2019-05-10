import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import "./Editor.css";
import Tabs from "./Tabs";
import Tree from "./Tree";
import { Scrollbars } from "react-custom-scrollbars";

// eslint-disable-next-line no-undef
const KeyCode = monaco.KeyCode;
const preventKeyCodes = [
  KeyCode.F1,
  KeyCode.F2,
  KeyCode.F3,
  KeyCode.F4,
  KeyCode.F5,
  KeyCode.F6,
  KeyCode.F7,
  KeyCode.F8,
  KeyCode.F9,
  KeyCode.F10,
  KeyCode.F11,
  KeyCode.F12,
  KeyCode.Tab
];

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      openPath: [],
      code: "",
      fileName: ""
    };
    this.editor = {};
    this.index = 0;
    this.github = props.github;
  }

  /**
   * Load the file from Github
   *
   * @memberof Editor
   */
  async componentDidMount() {
    await this.loadCodeFromFile("src/vs/editor/editor.api.ts");
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
      document.addEventListener("mousedown", this.replaceCharacter);
    }
  }

  /**
   * Helper function that loads a file from the github api
   *
   * @param {string} path file path to load
   * @memberof Editor
   */
  async loadCodeFromFile(path) {
    const { content } = await this.github.LoadFile(path);
    const openPath = path.split("/");
    const fileName = openPath.slice(-1)[0];
    this.setState({
      code: atob(content),
      openPath: openPath,
      tabs: [{ title: fileName, active: true, id: path }],
      fileName: fileName
    });
  }

  /**
   * Event handler that takes in an action and add the next few characters to the code editor
   *
   * @memberof Editor
   */
  replaceCharacter = e => {
    e.preventDefault();
    if (this.editor) {
      this.editor.focus();
      var line = this.editor.getPosition();
      var range = new this.monaco.Range(
        line.lineNumber,
        line.column,
        line.lineNumber,
        line.column
      );

      const newCode = this.state.code.slice(this.index, this.index + 3);
      this.index += 3;
      const text =
        newCode.charCodeAt(4) === 13
          ? newCode + this.state.code.charAt(this.index++)
          : newCode;
      const op = {
        text: text,
        range: range,
        forceMoveMarkers: true
      };
      this.editor.executeEdits("ottoCodes", [op]);
      this.editor.revealLineInCenterIfOutsideViewport(line.lineNumber, 0);
    }
  };

  /**
   * Once the monaco editor has mounted, get references to the editor and monaco objects
   *
   * @memberof Editor
   */
  editorDidMount = (editor, monaco) => {
    editor.focus();
    this.editor = editor;
    this.monaco = monaco;
    this.preventDefaultMonaco(this.editor);
  };

  /**
   * Clear out default key commands, so replaceCharacter will handle them
   *
   * @param {object} editor the monaco editor reference
   * @memberof Editor
   */
  preventDefaultMonaco(editor) {
    preventKeyCodes.forEach(keyCode => {
      editor.addCommand(keyCode, null);
    });
  }

  /**
   * Takes in a filename and returns the programming language
   *
   * @param {string} [fileName=""] filename to check
   * @returns {string} programming language of the file
   * @memberof Editor
   */
  getFileLanguage(fileName = "") {
    if (/.ts$/.test(fileName)) {
      return "typescript";
    }
    if (/.json$/.test(fileName)) {
      return "json";
    }

    //default to javascript
    return "javascript";
  }

  render() {
    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true
    };

    const openPath = this.state.openPath.slice();

    return (
      <div className="container">
        <div className="code-explorer">
          <Scrollbars style={{ width: "100%", height: "100%" }}>
            <h2>Otto Codes</h2>
            <Tree nodes={this.props.repository} openPath={openPath} />
          </Scrollbars>
        </div>
        <div className="code-editor">
          <Tabs tabs={this.state.tabs} />
          <MonacoEditor
            language={this.getFileLanguage(this.state.fileName)}
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
