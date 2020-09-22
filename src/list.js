import { BasicList, workspace } from 'coc.nvim';
import { listItem } from './utils/format';
import getConfiguration from './utils/getConfiguration';

export default class FilesList extends BasicList {
  constructor (fm) {
    const { nvim } = workspace;
    super(nvim);
    this.name = 'bibtex';
    this.defaultAction = 'insert';
    this.description = 'Search for bibtex entries.';
    this.detail = '';
    this.options = [];
    this.addAction('insert', async item => {
      const { nvim } = workspace;
      await nvim.command(`normal! i${item.data.cite}`);
      await nvim.call('feedkeys', ['a', 'n']);
    });
    this.fm = fm;
  }

  async loadItems () {
    if (this.fm.entries.length === 0) return null;
    const config = await getConfiguration();
    const items = [];
    for (const entry of this.fm.entries) {
      try {
        items.push({
          label: listItem(entry),
          filterText: entry.citationKey,
          data: {
            entry,
            cite: `${config.citation.before}${entry.citationKey}${config.citation.after}`
          }
        });
      } catch (err) {
        workspace.showMessage(`Error: ${err}
Entry: ${JSON.stringify(entry)}`, 'error');
      }
    }
    return items;
  }
}
