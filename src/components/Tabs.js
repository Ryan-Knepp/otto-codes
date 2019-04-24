import React, { Component } from "react";
import Tab from "./Tab";
import "./Tabs.css";

export class Tabs extends Component {
  render() {
    const { onClick, files } = this.props;
    return (
      <ol className="tab-list">
        {files.map(file => {
          return (
            <Tab
              key={file.id}
              onClick={onClick}
              active={file.active}
              id={file.id}
            >
              {file.title}
            </Tab>
          );
        })}
      </ol>
    );
  }
}

export default Tabs;
