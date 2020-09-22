import {BasicList, ListTask, Neovim, workspace} from 'coc.nvim'
import {EventEmitter} from 'events'
import BibTeXReader from './BibTexReader'
import cacheFullFilePaths from './cacheFullFilePaths'

class Task extends EventEmitter implements ListTask {
  private readonly storagePath: string
  constructor(storagePath: string) {
    super()
    this.storagePath = storagePath
  }
  public start(files: string[]): void {
    for (let file of files) {
      const task = new BibTeXReader(this.storagePath, file)
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
  public description = 'Search for bibtex entries.'
  public readonly detail = ``
  public options = []
  private storagePath: string
  private files: string[]

  constructor(nvim: Neovim, storagePath: string) {
    super(nvim)
    this.addAction('insert', async item => {
      const {nvim} = workspace
      await nvim.command(`normal! i${item.data.cite}`)
      await nvim.call('feedkeys', ['a', 'n'])
    })
    this.storagePath = storagePath
    this.cacheFilePaths().catch(() => '')
  }

  private async cacheFilePaths(): Promise<void> {
    this.files = await cacheFullFilePaths()
  }

  public async loadItems(): Promise<ListTask> {
    if (this.files.length === 0) return null
    const task = new Task(this.storagePath)
    task.start(this.files)
    return task
  }
}
