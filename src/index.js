import { commands, sources, workspace, listManager, events } from 'coc.nvim';
import fs from 'fs';
import { promisify } from 'util';
import List from './list';
import Complete from './complete';
import FileManager from './utils/FileManager';

const statPromise = promisify(fs.stat);
async function statAsync (filepath) {
  let stat = null;
  try {
    stat = await statPromise(filepath);
  } catch (e) {} // eslint-disable-line
  return stat;
}
function mkdirAsync (filepath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(filepath, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}
export async function activate (context) {
  const { subscriptions, storagePath } = context;
  const config = workspace.getConfiguration('lists');
  const disabled = config.get('disabledLists', []);
  // const { nvim } = workspace;
  const stat = await statAsync(storagePath);
  if (!stat || !stat.isDirectory()) {
    await mkdirAsync(storagePath);
  }
  const isDisabled = (name) => disabled.indexOf(name) !== -1;

  const fm = new FileManager(storagePath);

  const reloadFiles = async () => {
    await fm.loadFiles();
  };

  // Update cache on directory change:
  events.on('DirChanged', reloadFiles);

  if (!isDisabled('bibtex')) {
    await fm.loadFiles();
    subscriptions.push(commands.registerCommand('bibtex.reloadLibrary', async () => await reloadFiles()));
    subscriptions.push(listManager.registerList(new List(fm)));
    subscriptions.push(sources.createSource(await Complete(fm)));
  }
}
