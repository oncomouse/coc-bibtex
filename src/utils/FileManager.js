import {workspace} from 'coc.nvim';
import fs from 'fs';
import path from 'path';
import {sync as glob} from 'glob';
// import BibtexParser from '../vendor/bibtex-js/BibtexParser';
import bibTexParse from 'bibtex-parse-js';
import getConfiguration from '../utils/getConfiguration.js';

class FileManager {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.config = getConfiguration();
    this.entries = [];
  }

  async loadFiles() {
    const config = await getConfiguration();
    // const {nvim} = workspace;
    for (let file of config.files) {
      // const absoluteFile = await nvim.call('fnamemodify', [file, ':p']);
      const globFiles = glob(path.resolve(file));
      for (let globFile of globFiles) {
        this.entries = this.entries.concat(bibTexParse.toJSON(fs.readFileSync(globFile).toString()))
      }
    }
    workspace.showMessage(`Entries: ${JSON.stringify(this.entries)}`)
  }
}

export default FileManager;
