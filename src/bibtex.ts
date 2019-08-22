import { BasicList, ListTask, ListItem, Neovim, workspace } from 'coc.nvim'
import { Readable } from 'stream'
import { EventEmitter } from 'events'
import fs from 'fs'
import CacheInterface from './CacheInterface'
import BibTeXReader from './BibTexReader'
import cacheFullFilePaths from './cacheFullFilePaths'

class CacheReader extends Readable {
  constructor(file:string) {
    super({})
    const cacheData = JSON.parse(fs.readFileSync(file).toString())
    cacheData.map(data => this.push(JSON.stringify(data)))
    this.push(null)
  }
}

class Task extends EventEmitter implements ListTask {
  constructor() {
    super()
  }
  public start(files: string[]): void {
    for (let file of files) {
      const cacheFile = CacheInterface.cacheFilePath(file)
      const task = (fs.existsSync(cacheFile)) ? new CacheReader(cacheFile) : new BibTeXReader(file)
      task.on('data', data => {
        const json = JSON.parse(data)
        this.emit('data', json)
      })
      task.on('end', () => {
        this.emit('end')
      })
    }
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
    this.cacheFilePaths()
  }
  private async cacheFilePaths() {
    this.files = await cacheFullFilePaths()
  }

  public async loadItems(): Promise<ListTask> {
    if (this.files.length === 0) return null
    const task = new Task()
    task.start(this.files)
    return task
  }
}
