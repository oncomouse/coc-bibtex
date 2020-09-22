import {workspace} from 'coc.nvim';
import fs from 'fs';
import {sync as glob} from 'glob';
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
    const {nvim} = workspace;
    this.entries = [];
    for (const file of config.files) {
      const absoluteFile = await nvim.call('fnamemodify', [file, ':p']);
      const globFiles = glob(absoluteFile);
      for (const globFile of globFiles) {
        this.entries = this.entries.concat(bibTexParse.toJSON(fs.readFileSync(globFile).toString()));
      }
    }
  }
}

export default FileManager;
