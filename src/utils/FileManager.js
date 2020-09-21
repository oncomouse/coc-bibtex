import { workspace } from 'coc.nvim';
import fs from 'fs';
import packageJson from '../../package.json';
import BibtexParser from '../vendor/bibtex-js/BibtexParser';
const getConfigurationDefault = key => packageJson.contributes.configuration.properties[key].default;

const getConfiguration = async () => {
  const bibtexConfig = workspace.getConfiguration('bibtex');
  const listConfig = workspace.getConfiguration('list.source.bibtex');
  const completeConfig = workspace.getConfiguration('coc.source.bibtex');
  return Object.assign({
    enable: getConfigurationDefault('bibtex.enable'),
    files: getConfigurationDefault('list.source.bibtex.files'),
    citation: getConfigurationDefault('list.source.bibtex.citation'),
    shortcut: getConfigurationDefault('coc.source.bibtex.shortcut'),
    triggerCharacters: getConfigurationDefault('coc.source.bibtex.triggerCharacters'),
    fileTypes: getConfigurationDefault('coc.source.bibtex.filetypes')
  }, bibtexConfig, listConfig, completeConfig);
};

class FileManager {
  constructor (storagePath) {
    this.storagePath = storagePath;
    this.config = getConfiguration();
    this.entries = [];
  }

  async loadFiles () {
    const config = await this.config;
    const { nvim } = workspace;
    this.entries = config.files.map(async file => {
      const absoluteFile = await nvim.call('fnamemodify', [file, ':p']);
      const globFiles = (await nvim.call('glob', absoluteFile)).split('\n');
      return globFiles.map(file => {
        workspace.showMessage(file);
        const parser = new BibtexParser();
        parser.input = fs.readFileSync(file);
        parser.bibtex();
        return parser.entries;
      });
    }).flat();
    workspace.showMessage(JSON.stringify(this.entries));
  }
}

export default FileManager;
