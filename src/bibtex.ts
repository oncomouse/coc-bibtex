import { ChildProcess, spawn } from 'child_process'
import { BasicList, ListTask, Neovim, workspace } from 'coc.nvim'
import { EventEmitter } from 'events'
import readline from 'readline'
import { executable } from './util'
import { installFzfBibTeX, goBinPath } from './commands'

class Task extends EventEmitter implements ListTask {
  private processes: ChildProcess[] = []

  public start(cmd: string, files: string[], outputCmd: string): void {
    let remain = files.length
    for (let file of files) {
      const process = spawn(cmd, [file])
      this.processes.push(process)
      process.on('error', e => {
        this.emit('error', e.message)
      })
      const rl = readline.createInterface(process.stdout)
      process.stderr.on('data', chunk => {
        console.error(chunk.toString('utf8')) // tslint:disable-line
      })

      rl.on('line', (line: string) => {
        const id = `@${line.replace(/\x1b\[[0-9;]*m/g,'').split('@').slice(-1)[0]}`.trim()
        const outputProcess = spawn(outputCmd, [file])
        outputProcess.stdout.on('data', (cite) => {
          this.emit('data', {
            label: line,
            filterText: id,
            data: {
              cite: cite.toString().trim(),
            }
          })
        })
        outputProcess.stdin.write(id)
        outputProcess.stdin.end()
      })
      rl.on('close', () => {
        remain = remain - 1
        if (remain == 0) {
          this.emit('end')
        }
      })
    }
  }

  public dispose(): void {
    for (let process of this.processes) {
      if (!process.killed) {
        process.kill()
      }
    }
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
  public async getCommand(): Promise<{ cmd: string, outCmd: string }> {
    const config = workspace.getConfiguration('list.source.bibtex')
    let cmd = await goBinPath('bibtex-ls')
    if (!executable(cmd)) {
      const installed = await installFzfBibTeX()
      if(!installed) {
        workspace.showMessage('There was a problem installing fzf-bibtex.', 'error')
        return null
      }
    }
    const outCmd = await goBinPath(config.get<string>('outputCommand', 'bibtex-cite'))
    return { cmd, outCmd }
  }

  public async loadItems(): Promise<ListTask> {
    const res = await this.getCommand()
    if (!res) return null
    if (this.files.length === 0) return null
    const task = new Task()
    task.start(res.cmd, this.files, res.outCmd)
    return task
  }
}
