import {workspace} from 'coc.nvim';
import getConfiguration from './utils/getConfiguration';
import {previewWindow} from './utils/format';
const has = (key, obj) => Object.prototype.hasOwnProperty.call(obj, key);
const makeSource = async (fm) => {
  const config = await getConfiguration();
  // workspace.showMessage(JSON.stringify(fm.entries));
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
        const items = fm.entries.map(entry => ({
          word: entry.citationKey,
          abbr: `[${entry.citationKey}] ${(has('title', entry.entryTags) ? entry.entryTags.title : 'Unknown title').replace(/[{}]+/g, '')}`,
          menu: config.shortcut,
          info: previewWindow(entry)
        }));
        resolve({items});
      });
    }
  };
};

export default makeSource;
