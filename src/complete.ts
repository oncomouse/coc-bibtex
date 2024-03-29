import { CompleteOption, CompleteResult, VimCompleteItem, workspace } from 'coc.nvim'
import { CancellationToken } from 'vscode-languageserver-protocol'
import cacheFullFilePaths from './cacheFullFilePaths'
import BibTeXReader from './BibTexReader'
import BibTexEntry from './BibTexEntry'

const has = (key:any, obj:object):boolean => Object.prototype.hasOwnProperty.call(obj, key)

const config = workspace.getConfiguration('bibtex')
const truncate = config.get<number>('truncate')
const makeSource = (storagePath:string) => ({
  name: 'bibtex',
  triggerOnly: true,
  triggerCharacters: config.get<string[]>('triggerCharacters', ['@']),
  fileTypes: config.get<string[]>('fileTypes', ['latex', 'pandoc', 'markdown']),
  shortcut: config.get<string>('shortcut', 'BIB'),
  enable: config.get<boolean>('enable', true),
  doComplete: async (_opt: CompleteOption, token:CancellationToken): Promise<CompleteResult> => {
    const files:string[] = await cacheFullFilePaths()
    const items:VimCompleteItem[] = []
    return new Promise<CompleteResult>(resolve => {
      token.onCancellationRequested(() => {
        resolve(null)
      })
      let remaining = files.length
      files.forEach(file => {
        const task = new BibTeXReader(storagePath, file)
        task.on('data', (json:string) => {
          const entry:BibTexEntry = JSON.parse(json)
          const { label, properties } = entry.data.entry
          const display_label = truncate !== undefined ? label.slice(0, truncate) : label
          items.push({
            word: label,
            abbr: `[${display_label}] ${(has('title', properties) ? properties.title : 'Unknown title').replace(/[{}]+/g,'')}`,
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
})
/* const source = */

export default makeSource
