const CARRIAGE_RETURN = 13;
const CHARACTERS_TO_ADD = 5;

export default class EditorController {
  constructor(repoHandler) {
    this.editor = null;
    this.monaco = null;
    this.currentPath = "";
    this.currentCode = null;
    this.repoHandler = repoHandler;
    this.codeFileMap = new Map();
  }

  setEditor(editor, monaco) {
    this.editor = editor;
    this.monaco = monaco;
    this.preventDefaultMonaco();
  }

  preventDefaultMonaco() {
    const KeyCode = this.monaco.KeyCode;
    [
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
      KeyCode.Tab,
    ].forEach((keyCode) => {
      this.editor.addCommand(keyCode, null);
    });
  }

  async getRepository() {
    const success = await this.repoHandler.LoadRepository();
    if (success) {
      return [
        ...this.repoHandler.repository.folders,
        ...this.repoHandler.repository.files,
      ];
    }
    return [];
  }

  async setCurrentCode(path) {
    this.currentPath = path;
    if (!this.codeFileMap.has(path)) {
      const { content } = await this.repoHandler.LoadFile(path);
      const codeFile = new CodeFile(atob(content));
      this.codeFileMap.set(path, codeFile);
      this.currentCode = codeFile;
    } else {
      this.currentCode = this.codeFileMap.get(path);
    }
  }

  addCodeToEditor() {
    const editor = this.editor;
    const monaco = this.monaco;
    if (!editor || !monaco) {
      throw new Error("Editor and monaco are required. Call setEditor first.");
    }

    const codeFile = this.currentCode;
    if (!codeFile) {
      throw new Error(
        "The current code file has not been loaded. Call setCurrentCode first."
      );
    }

    editor.focus();
    const line = editor.getPosition();
    const range = new monaco.Range(
      line.lineNumber,
      line.column,
      line.lineNumber,
      line.column
    );

    const newCode = codeFile.code.slice(
      codeFile.index,
      codeFile.index + CHARACTERS_TO_ADD
    );
    codeFile.index += CHARACTERS_TO_ADD;
    const text =
      newCode.charCodeAt(4) === CARRIAGE_RETURN
        ? newCode + codeFile.code.charAt(codeFile.index++)
        : newCode;
    const op = {
      text: text,
      range: range,
      forceMoveMarkers: true,
    };

    editor.executeEdits("ottoCodes", [op]);
    editor.revealLineInCenterIfOutsideViewport(line.lineNumber, 0);
  }

  clearEditor() {
    const editor = this.editor;
    const monaco = this.monaco;
    if (!editor || !monaco) {
      throw new Error("Editor and monaco are required. Call setEditor first.");
    }

    editor.focus();
    const line = editor.getPosition();
    const range = new monaco.Range(0, 0, line.lineNumber, line.column);

    const op = {
      text: "",
      range: range,
      forceMoveMarkers: true,
    };

    editor.executeEdits("ottoCodes", [op]);
    editor.revealLineInCenterIfOutsideViewport(0, 0);
    this.currentCode.index = 0;
  }
}

class CodeFile {
  constructor(code) {
    this.code = code;
    this.index = 0;
  }
}
