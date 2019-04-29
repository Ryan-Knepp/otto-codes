import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import * as code from "./apis/test.json";
import "./App.css";
import Tabs from "./components/Tabs";
import Tree from "./components/Tree";
import github from "./apis/github";
import { Scrollbars } from "react-custom-scrollbars";

const files = [
  { title: "File 1", active: true, id: 1 },
  { title: "File 2", active: false, id: 2 },
  { title: "File 3", active: false, id: 3 }
];

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor: {},
      files: files,
      openPath: [],
      code: ""
    };
    this.editor = {};
    this.repository = [];
    this.index = 0;
    this.github = new github();
    this.github.InitRepo("Microsoft", "vscode");
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.replaceCharacter);
    await this.getRepository();
    await this.loadFile("src/vs/editor/editor.api.ts");
  }

  async getRepository() {
    const data = await this.github.LoadRepository();
    this.repository = [
      ...this.github.repository.folders,
      ...this.github.repository.files
    ];
  }

  async loadFile(path) {
    const { content } = await this.github.LoadFile(path);
    const openPath = path.split("/");
    const fileName = openPath.slice(-1)[0];
    this.setState({
      code: atob(content),
      openPath: openPath,
      files: [{ title: fileName, active: true, id: path }]
    });
  }

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
      const nextChar = this.state.code.charAt(this.index++);
      const text =
        nextChar.charCodeAt(0) === 13
          ? nextChar + this.state.code.charAt(this.index++)
          : nextChar;
      const op = {
        text: text,
        range: range,
        forceMoveMarkers: true
      };
      this.editor.executeEdits("ottoCodes", [op]);
      this.editor.revealLineInCenterIfOutsideViewport(line.lineNumber, 0);
    }
  };

  editorDidMount = (editor, monaco) => {
    editor.focus();
    this.editor = editor;
    this.monaco = monaco;
    this.preventDefaultMonaco(this.editor);
  };

  preventDefaultMonaco(editor) {
    preventKeyCodes.forEach(keyCode => {
      editor.addCommand(keyCode, null);
    });
  }

  onChange = (newValue, e) => {
    //console.log("onChange", newValue, e);
  };

  onToggle = (node, toggled) => {
    if (this.state.cursor) {
      this.setState({ active: false });
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  };

  onTabClick = id => {
    this.setState({
      files: this.state.files.map(file => {
        if (file.id === id) {
          file.active = true;
        } else {
          file.active = false;
        }
        return file;
      })
    });
  };

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
            <Tree nodes={this.repository} openPath={openPath} />
          </Scrollbars>
        </div>
        <div className="code-editor">
          <Tabs files={this.state.files} onClick={this.onTabClick} />
          <MonacoEditor
            language="javascript"
            theme="vs-dark"
            options={options}
            editorDidMount={this.editorDidMount}
          />
        </div>
      </div>
    );
  }
}

export default App;
