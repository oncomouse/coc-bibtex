import { workspace } from 'coc.nvim';
import fs from 'fs';
import BibtexParser from '../vendor/bibtex-js/BibtexParser';
import getConfiguration from '../utils/getConfiguration.js';

class FileManager {
  constructor (storagePath) {
    this.storagePath = storagePath;
    this.config = getConfiguration();
    this.entries = {};
  }

  async loadFiles () {
    const config = await this.config;
    const { nvim } = workspace;
    this.entries = await config.files.reduce(async (bib, file) => {
      const absoluteFile = await nvim.call('fnamemodify', [file, ':p']);
      const globFiles = (await nvim.call('glob', absoluteFile)).split('\n');
      return Object.assign({}, bib, globFiles.reduce((bib, file) => {
        const parser = new BibtexParser();
        parser.input = fs.readFileSync(file).toString();
        try {
          parser.bibtex();
        } catch (err) {
          workspace.showMessage(`There was a problem with an entry: ${err}`);
        }
        return Object.assign({}, bib, parser.entries);
      }, {}));
    }, {});
  }
}

export default FileManager;
