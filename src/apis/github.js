import axios from "axios";
import { array } from "prop-types";

class github {
  constructor() {
    this.fetcher = axios.create({
      baseURL: "https://api.github.com/repos/"
    });
    this.owner = "";
    this.repoName = "";
    this.repository = {};
    this.repoSha = "";
  }

  _getFileURL(path) {
    return `${this.owner}/${this.repoName}/contents/${path}`;
  }

  _getRecursiveTreeURL(sha) {
    return `${this.owner}/${this.repoName}/git/trees/${sha}?recursive=1`;
  }

  _getBranch(branch) {
    return `${this.owner}/${this.repoName}/branches/${branch}`;
  }

  InitRepo(owner, repoName, head) {
    this.owner = owner;
    this.repoName = repoName;
  }

  LoadFile(path) {
    return new Promise(async (resolve, reject) => {
      const { data } = await this.fetcher.get(this._getFileURL(path));
      if (data) {
        resolve(data);
      } else {
        reject(Error("Failed to get github data"));
      }
    });
  }

  LoadRepoHead() {
    return new Promise(async (resolve, reject) => {
      const { data } = await this.fetcher.get(this._getBranch("master"));
      if (data) {
        this.repoSha = data.commit.sha;
        resolve(data);
      } else {
        reject(Error("Failed to get github data"));
      }
    });
  }

  LoadRepository() {
    return new Promise(async (resolve, reject) => {
      if (!this.repoSha) await this.LoadRepoHead();
      if (this.repoSha) {
        const { data } = await this.fetcher.get(
          this._getRecursiveTreeURL(this.repoSha)
        );
        if (data) {
          this.repository = {
            name: this.repoName,
            path: "",
            sha: this.repoSha,
            folders: [],
            files: []
          };
          let parentTree = [this.repository];
          let show = false;
          for (const node of data.tree) {
            while (
              parentTree.length != 1 &&
              !node.path.includes(parentTree[0].path)
            ) {
              parentTree.shift();
            }
            if (node.type === "tree") {
              const folder = {
                name: node.path.split("/").pop(),
                path: node.path,
                sha: node.sha,
                type: "folder",
                folders: [],
                files: []
              };
              parentTree[0].folders.push(folder);
              parentTree = [folder, ...parentTree];
            } else {
              //parentTree.filter(tree => node.path.includes(tree.path));
              const file = {
                name: node.path.split("/").pop(),
                path: node.path,
                sha: node.sha,
                type: "file"
              };
              parentTree[0].files.push(file);
            }
          }
          resolve(true);
        } else {
          reject(false);
        }
      } else {
        reject(false);
      }
    });
  }

  isFileInFolder(filePath, folderPath) {
    const splitFilePath = filePath.split("/");
    splitFilePath.pop();
    const fileParentPath = splitFilePath.join("/");
    return fileParentPath === folderPath;
  }
}

export default github;
