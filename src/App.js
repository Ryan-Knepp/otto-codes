import React, { Component } from "react";
import Editor from "./components/Editor";
import Welcome from "./components/Welcome";
import github from "./apis/github";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canICode: false,
      isRepoLoaded: false,
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
        isRepoLoaded: true,
      });
    }
  }

  startCoding = () => {
    this.setState({ canICode: true });
  };

  render() {
    return (
      <>
        {this.state.isRepoLoaded ? (
          <Editor repoHandler={this.github} canICode={this.state.canICode} />
        ) : null}
        {!this.state.canICode ? <Welcome onGo={this.startCoding} /> : null}
      </>
    );
  }
}

export default App;
