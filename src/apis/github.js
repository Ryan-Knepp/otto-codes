import axios from "axios";

class github {
  constructor() {
    this.fetcher = axios.create({
      baseURL: "https://api.github.com/repos/"
    });
    this.owner = "";
    this.repo = "";
    this.fileStructure = {};
  }

  _getFileURL(path) {
    return this.owner + "/" + this.repo + "/contents/" + path;
  }

  _getRecursiveTreeURL(path) {
    return this.owner + "/" + this.repo + "/git/trees/" + path + "?recursive=1";
  }

  InitRepo(owner, repo) {
    this.owner = owner;
    this.repo = repo;
  }

  LoadFile(path) {
    return new Promise(async (resolve, reject) => {
      const data = await this.fetcher.get(this._getFileURL(path));
      if (data) {
        resolve(data);
      } else {
        reject(Error("Failed to get github data"));
      }
    });
  }

  LoadRepository() {
    return new Promise(async (resolve, reject) => {
      const data = await this.fetcher.get(_getFileURL());
      if (data) {
        const 
        resolve(data);
      } else {
        reject(Error("Failed to get github data"));
      }
    });
  }
}

export default github;
