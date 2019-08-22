import { CompleteOption, CompleteResult, VimCompleteItem, workspace } from 'coc.nvim'
import { CancellationToken } from 'vscode-languageserver-protocol'
import cacheFullFilePaths from './cacheFullFilePaths'
import BibTeXReader from './BibTexReader'
import BibTexEntry from './BibTexEntry'

const source = {
  name: 'bibtex',
  triggerOnly: true,
  doComplete: async (opt: CompleteOption, token:CancellationToken): Promise<CompleteResult> => {
    const files:string[] = await cacheFullFilePaths()
    const items:VimCompleteItem[] = []
    return new Promise<CompleteResult>((resolve, reject) => {
      token.onCancellationRequested(() => {
        resolve(null)
      })
      let remaining = files.length
      files.forEach(file => {
        const task = new BibTeXReader(file)
        task.on('data', (json:string) => {
          const entry:BibTexEntry = JSON.parse(json)
          items.push({
            word: entry.data.entry.label,
            abbr: `[${entry.data.entry.label}] ${entry.data.entry.properties.title.replace(/[{}]+/g,'')}`,
            menu: this.menu || '[bibtex]',
          })
        })
        task.on('end', () => {
          remaining -= 1
          if(remaining === 0) {
            resolve({items})
          }
        })
      })
    })
  },
}

export default source
