/**
 * Takes in a filename and returns the programming language
 *
 * @param {string} [fileName=""] filename to check
 * @returns {string} programming language of the file - 'javascript' if it can't be determined
 * @memberof Editor
 */
export function getFileLanguage(fileName = "") {
  if (/.ts$/.test(fileName)) {
    return "typescript";
  }
  if (/.json$/.test(fileName)) {
    return "json";
  }

  //default to javascript
  return "javascript";
}
