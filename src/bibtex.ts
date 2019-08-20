import { BasicList, ListTask, ListItem, Neovim, workspace } from 'coc.nvim'
import { EventEmitter } from 'events'
import fs from 'fs'
import Cite from './vendor/citation-js'

class Task extends EventEmitter implements ListTask {
  private processes: Promise<ListItem>[] = []

  public start(files: string[]): void {
    for (let file of files) {
      const bibData = Cite.parse.bibtex.text(fs.readFileSync(file).toString())
      bibData.forEach(entry => {
        this.processes.push(new Promise<ListItem>(resolve => {
          const cite = (new Cite(entry, {})).format('bibliography', {append: entry => `[${entry.id}]`})
          const data = {
            label: cite,
            filterText: entry.id,
            data: {
              cite: `@${entry.id}`
            }
          }
          this.emit('data', data)
          resolve(data)
        }))
      })
    }
    Promise.all(this.processes).then(() => this.emit('end'))
  }

  public dispose(): void {
  }
}

export default class FilesList extends BasicList {
  public readonly name = 'bibtex'
  public readonly defaultAction = 'insert'
  public description = 'Search bibtex documents with bibtex-ls'
  public readonly detail = ``
  public options = []
  private files: string[]

  constructor(nvim: Neovim) {
    super(nvim)
    this.addAction('insert', async (item) => {
      const {nvim} = workspace
      await nvim.command(`normal! i [${item.data.cite}]`)
      await nvim.call('feedkeys', ['a', 'n'])
    })
    this.files = []
    this.cacheFullFilePaths()
  }

  async cacheFullFilePaths() {
    const {nvim} = workspace
    const config = workspace.getConfiguration('list.source.bibtex')
    const files = config.get<string[]>('files', [])
    if (files.length === 0) {
      workspace.showMessage('No .bib files provided; set list.source.bibtex to a list of .bib files')
    }
    for (let i = 0; i < files.length; i++) {
      const fullPath = await nvim.call('expand', files[i])
      this.files.push(fullPath)
    }
  }

  public async loadItems(): Promise<ListTask> {
    if (this.files.length === 0) return null
    const task = new Task()
    task.start(this.files)
    return task
  }
}
