import fs from 'fs/promises'

export class FileReader {
  /**
   * @param {string} filePath Path of file to read
   * @returns {Promise<string>} Content of file (decoded with UTF-8)
   */
  async read(filePath) {
    return fs.readFile(filePath, {encoding: 'utf-8'});
  }
}
