import { CompleteOption, CompleteResult, VimCompleteItem } from 'coc.nvim'
import { CancellationToken } from 'vscode-languageserver-protocol'
import cacheFullFilePaths from './cacheFullFilePaths'
import BibTeXReader from './BibTexReader'
import BibTexEntry from './BibTexEntry'

const source = {
  name: 'bibtex',
  triggerCharacters: ['@'],
  doComplete: async (opt: CompleteOption, token:CancellationToken): Promise<CompleteResult> => {
    const files:string[] = await cacheFullFilePaths()
    const items:VimCompleteItem[] = []
    const {input} = opt
    return new Promise<CompleteResult>((resolve, reject) => {
      files.forEach(file => {
        const task = new BibTeXReader(file)
        task.on('data', (json:string) => {
          const entry:BibTexEntry = JSON.parse(json)
          // Implement matching here
          items.push({
            word: entry.data.cite,
            abbr: entry.data.entry.title,
            menu: this.menu || '[bibtex]',
          })
        })
      })
      resolve({
        items
      })
    })
  },
}

export default source
