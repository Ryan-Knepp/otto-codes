import JSFile from "../icons/JSFile";
import File from "../icons/File";
import Folder from "../icons/Folder";
import FolderOpen from "../icons/FolderOpen";
import JSONFile from "../icons/JSONFile";
import SrcFolder from "../icons/SrcFolder";
import SrcFolderOpen from "../icons/SrcFolderOpen";
import TSDFile from "../icons/TSDFile";
import TSFile from "../icons/TSFile";
import VSCodeFolder from "../icons/VSCodeFolder";
import GitFile from "../icons/GitFile";
import GithubFolder from "../icons/GithubFolder"

export function getFolderIcon(name, isOpen) {
  switch (name) {
    case "src":
      return isOpen ? SrcFolderOpen : SrcFolder;
    case ".vscode":
      return VSCodeFolder;
    case ".github":
    return GithubFolder;
    default:
      return isOpen ? FolderOpen : Folder;
  }
}

export function getFileIcon(name) {
  if (/.d.ts$/.test(name)) {
    return TSDFile;
  }
  if (/.ts$/.test(name)) {
    return TSFile;
  }
  if (/.js$/.test(name)) {
    return JSFile;
  }
  if (/.json$/.test(name)) {
    return JSONFile;
  }
  if (/.git/.test(name)) {
      return GitFile;
  }
  return File;
}
