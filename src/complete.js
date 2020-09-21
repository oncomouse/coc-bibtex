import { workspace } from 'coc.nvim';
import getConfiguration from './utils/getConfiguration';
const has = (key, obj) => Object.prototype.hasOwnProperty.call(obj, key);
const makeSource = async (fm) => {
  const config = await getConfiguration();
  workspace.showMessage(JSON.stringify(fm.entries));
  return {
    name: 'bibtex',
    triggerOnly: true,
    triggerCharacters: config.triggerCharacters,
    fileTypes: config.fileTypes,
    shortcut: config.shortcut,
    enable: config.enable,
    doComplete: async (_opt, token) => {
      return new Promise(resolve => {
        token.onCancellationRequested(() => {
          resolve(null);
        });
        const items = Object.values(fm.entries).map(entry => ({
          word: entry.BIBTEXKEY,
          abbr: `[${entry.BIBTEXKEY}] ${(has('title', entry) ? entry.title : 'Unknown title').replace(/[{}]+/g, '')}`,
          menu: config.shortcut
        }));
        resolve({ items });
      });
    }
  };
};

export default makeSource;
