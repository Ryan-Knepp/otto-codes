import axios from "axios";

/**
 * Class that handles working with the Github API
 *
 * @class github
 */
class github {
  constructor(owner, repoName) {
    this.fetcher = axios.create({
      baseURL: "https://api.github.com/repos/"
    });
    this.owner = owner;
    this.repoName = repoName;
    this.repository = {};
    this.repoSha = "";
  }

  /**
   * Build the api end point for a file
   *
   * @param {string} path relative path of the file
   * @returns end point url to retrieve a file
   * @memberof github
   */
  _getFileURL(path) {
    return `${this.owner}/${this.repoName}/contents/${path}`;
  }

  /**
   * Build the reucursive tree end point url for the repository
   *
   * @returns end point url to get the recursive tree for the repository
   * @memberof github
   */
  _getRecursiveTreeURL() {
    return `${this.owner}/${this.repoName}/git/trees/${
      this.repoSha
    }?recursive=1`;
  }

  /**
   * Build the api end point to get a branch of the repository
   *
   * @param {string} branch name of the branch to load (i.e. master)
   * @returns end point url to retrieve branch data
   * @memberof github
   */
  _getBranch(branch) {
    return `${this.owner}/${this.repoName}/branches/${branch}`;
  }

  /**
   * Load a single file from the repository
   *
   * @param {string} path the relative path of the file to load
   * @returns data object returned from GitHub API
   *          - content: contains the 64-bit encoded file string
   * @memberof github
   */
  LoadFile(path) {
    return new Promise(async (resolve, reject) => {
      const { data } = await this.fetcher.get(this._getFileURL(path));
      if (data) {
        resolve(data);
      } else {
        reject(Error("Failed to get file"));
      }
    });
  }

  /**
   * Loads the master branch meta data.
   *
   * @returns A promise that resolves to the master branch meta data
   * @memberof github
   */
  LoadRepoHead() {
    return new Promise(async (resolve, reject) => {
      const { data } = await this.fetcher.get(this._getBranch("master"));
      if (data) {
        this.repoSha = data.commit.sha;
        resolve(data);
      } else {
        reject(Error("Failed to get repository"));
      }
    });
  }

  /**
   * Load the entire repository file structure
   *
   * @returns A promise that resolves to true if everything loads properly
   * @memberof github
   */
  LoadRepository() {
    return new Promise(async (resolve, reject) => {
      if (!this.repoSha) await this.LoadRepoHead();
      if (this.repoSha) {
        const { data } = await this.fetcher.get(
          this._getRecursiveTreeURL(this.repoSha)
        );
        if (data) {
          this.repository = this.createFolder(this.repoName, "", this.repoSha);
          let parentTree = [this.repository];
          data.tree.forEach(node => {
            parentTree = this.getParentDirectory(parentTree, node.path);
            if (node.type === "tree") {
              const folder = this.createFolder(
                node.path.split("/").pop(),
                node.path,
                node.sha
              );
              parentTree[0].folders = [...parentTree[0].folders, folder];
              parentTree = [folder, ...parentTree];
            } else {
              const file = this.createFile(
                node.path.split("/").pop(),
                node.path,
                node.sha
              );
              parentTree[0].files = [...parentTree[0].files, file];
            }
          });
          resolve(true);
        } else {
          reject(Error("Repository has no data"));
        }
      } else {
        reject(Error("Can't find repository"));
      }
    });
  }

  /**
   * Adjust the tree stack to the level of the passed in path
   *
   * @param {array} parentTree array/stack of the current tree level - 0 index is current folder, last index is root
   * @param {string} currentPath path to adjust the tree to
   * @returns array of the new tree level
   * @memberof github
   */
  getParentDirectory(parentTree, currentPath) {
    while (
      parentTree.length != 1 &&
      !currentPath.includes(parentTree[0].path)
    ) {
      parentTree.shift();
    }
    return parentTree;
  }

  /**
   * Creates a new folder object
   *
   * @param {string} name name of the folder
   * @param {string} path relative path of the folder
   * @param {string} sha folder SHA
   * @returns a folder object
   * @memberof github
   */
  createFolder(name, path, sha) {
    return {
      name: name,
      path: path,
      sha: sha,
      type: "folder",
      folders: [],
      files: []
    };
  }

  /**
   * Creates a new file object
   *
   * @param {string} name name of the file
   * @param {string} path relative path of the file
   * @param {string} sha file SHA
   * @returns a file object
   * @memberof github
   */
  createFile(name, path, sha) {
    return {
      name: name,
      path: path,
      sha: sha,
      type: "file"
    };
  }
}

export default github;
