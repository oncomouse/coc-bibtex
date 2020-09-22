import { BasicList, workspace } from 'coc.nvim';
import { EventEmitter } from 'events';
import { listItem } from './utils/format';
import getConfiguration from './utils/getConfiguration';

class Task extends EventEmitter {
  constructor (fm) {
    super();
    this.fm = fm;
  }

  async start () {
    const config = await getConfiguration();
    for (const entry of this.fm.entries) {
      this.emit({
        label: listItem(entry),
        filterText: entry.citationKey,
        data: {
          entry,
          cite: `${config.citation.before}${entry.citationKey}${config.citation.after}`
        }
      });
    }
    this.emit('end');
  }

  dispose () {
  }
}

export default class FilesList extends BasicList {
  constructor (nvim, fm) {
    super(nvim);
    this.name = 'bibtex';
    this.defaultAction = 'insert';
    this.description = 'Search for bibtex entries.';
    this.detail = '';
    this.options = [];
    this.addAction('insert', async item => {
      const { nvim } = workspace;
      await nvim.command(`normal! i ${item.data.cite}`);
      await nvim.call('feedkeys', ['a', 'n']);
    });
    workspace.showMessage(fm);
    this.fm = fm;
  }

  async loadItems () {
    if (this.fm.entries.length === 0) return null;
    const task = new Task(this.fm);
    task.start();
    return task;
  }
}
