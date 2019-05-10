import React, { Component } from "react";
import Editor from "./components/Editor";
import Welcome from "./components/Welcome";
import github from "./apis/github";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canICode: false,
      repository: []
    };
    this.github = new github("Microsoft", "vscode");
  }

  async componentDidMount() {
    await this.getRepository();
  }

  async getRepository() {
    const success = await this.github.LoadRepository();
    if (success) {
      this.setState({
        repository: [
          ...this.github.repository.folders,
          ...this.github.repository.files
        ]
      });
    }
  }

  onNPMInstall = () => {
    this.setState({ canICode: true });
  };

  render() {
    return (
      <React.Fragment>
        <Editor
          repository={this.state.repository}
          github={this.github}
          canICode={this.state.canICode}
        />
        {!this.state.canICode ? <Welcome onGo={this.onNPMInstall} /> : null}
      </React.Fragment>
    );
  }
}

export default App;
