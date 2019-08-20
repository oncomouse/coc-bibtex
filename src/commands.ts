import {workspace} from 'coc.nvim'
import path from 'path'
import fs from 'fs'
import which from 'which'
import {executable} from './util'

// From https://github.com/josa42/coc-go/blob/master/src/utils/config.ts:
interface State {
  storagePath?: string
}

const state: State = {}
export function setStoragePath(dir: string): void {
  state.storagePath = dir
}
async function configDir(...names: string[]): Promise<string> {
  const storage = state.storagePath || (() => {
    const home = require('os').homedir()
    return path.join(home, '.config', 'coc', 'extensions', 'bibtex')
  })()

  if(!state.storagePath) {
    setStoragePath(storage)
  }

  const dir = path.join(storage, ...names)

  return new Promise((resolve) => {
    fs.mkdirSync(dir, {recursive: true})
    resolve(dir)
  })
}

// Adapted from https://github.com/josa42/coc-go/blob/master/src/utils/tools.ts:
export async function goBinPath(cmd: string): Promise<string> {
  return path.join(await configDir('bin'), cmd)
}

export async function goBinExists(cmd: string): Promise<boolean> {
  const bin = await goBinPath(cmd)
  return await workspace.nvim.call('executable', [bin])
}
async function goRun(args: string): Promise<boolean> {
  const gopath = await configDir('tools')

  const env = which.sync('env')
  const go = which.sync('go')
  const cmd = `${env} GOPATH=${gopath} ${go} ${args}`
  const res = await workspace.runTerminalCommand(cmd)
  return res.success
}

export const installFzfBibTeX = async () => {
  if (!executable('go')) {
    workspace.showMessage('Cannot find a go binary. Without Go, cannot install fzf-bibtex. Please visit https://golang.org/doc/install for instructions on installing Go.', 'error')
    return false
  }
  const source = 'github.com/msprev/fzf-bibtex'

  if (await goBinExists('bibtex-ls')) {
    return true
  }

  workspace.showMessage('Installing fzf-bibtex, one moment …')
  return (
    await goRun(`get -d -u ${source}/cmd/bibtex-ls`) &&
    await goRun(`build -o ${await goBinPath('bibtex-ls')} ${path.join(source, 'cmd', 'bibtex-ls')}`) &&
    await goRun(`build -o ${await goBinPath('bibtex-markdown')} ${path.join(source, 'cmd', 'bibtex-markdown')}`) &&
    await goRun(`build -o ${await goBinPath('bibtex-cite')} ${path.join(source, 'cmd', 'bibtex-cite')}`)
  )
}
