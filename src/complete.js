import getConfiguration from './utils/getConfiguration';
import { previewWindow, completeAbbr } from './utils/format';
const makeSource = async (fm) => {
  const config = await getConfiguration();
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
          abbr: `[${entry.citationKey}] ${completeAbbr(entry).replace(/[{}]+/g, '')}`,
          menu: config.shortcut,
          info: previewWindow(entry)
        }));
        resolve({ items });
      });
    }
  };
};

export default makeSource;
