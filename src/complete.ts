import { CompleteOption, CompleteResult } from 'coc.nvim'
import { CancellationToken } from 'vscode-languageserver-protocol'
import fs from 'fs'
import cacheFullFilePaths from './cacheFullFilePaths'
import BibTeXReader from './BibTexReader'
import BibTexEntry from './BibTexEntry'
import CacheFileReader from './CacheFileReader'
import CacheInterface from './CacheInterface'

const source = {
  name: 'bibtex',
  triggerCharacters: ['@'],
  doComplete: async (opt: CompleteOption, token:CancellationToken): Promise<CompleteResult> => {
    const files = await cacheFullFilePaths()
    const items = []
    return new Promise<CompleteResult>((resolve, reject) => {
      files.forEach(file => {
        const cacheFile = CacheInterface.cacheFilePath(file)
        const task = (fs.existsSync(cacheFile)) ? new CacheFileReader(cacheFile) : new BibTeXReader(file)
        task.on('data', (json:string) => {
          const entry:BibTexEntry = JSON.parse(json)
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
