import {ExtensionContext, commands, sources, workspace, listManager} from 'coc.nvim'
import fs from 'fs'
import BibTeXList from './list'
import BibTexSource from './complete'
import cacheFullFilePaths from './cacheFullFilePaths'
import BibTeXReader from './BibTexReader'
import CacheInterface from './CacheInterface'
import util from 'util'

async function statAsync(filepath: string): Promise<fs.Stats | null> {
  let stat = null
  try {
    stat = await util.promisify(fs.stat)(filepath)
  } catch (e) { } // tslint:disable-line
  return stat
}
function mkdirAsync(filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(filepath, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export async function activate(context: ExtensionContext): Promise<void> {
  const {subscriptions,storagePath} = context
  const config = workspace.getConfiguration('lists')
  const disabled = config.get('disabledLists', [])
  const {nvim} = workspace
  let stat = await statAsync(storagePath)
  if (!stat || !stat.isDirectory()) {
    await mkdirAsync(storagePath)
  }
  function isDisabled(name:string): boolean {
    return disabled.indexOf(name) !== -1
  }

  async function updateCache(): Promise<void> {
    const files = await cacheFullFilePaths()
    files.forEach(file => {
      const cacheFile = CacheInterface.cacheFilePath(storagePath, file)
      if (fs.existsSync(cacheFile)) return
      workspace.showMessage(`Caching BibTeX file ${file}, one moment…`)
      const task = new BibTeXReader(storagePath, file)
      task.on('data', () => {})
      task.on('end', () => {
        workspace.showMessage('Done')
        setTimeout(() => nvim.command('echom ""'), 500)
      })
    })
  }

  if (!isDisabled('bibtex')) {
    await updateCache()
    subscriptions.push(commands.registerCommand('bibtex.reloadLibrary', updateCache))
    subscriptions.push(listManager.registerList(new BibTeXList(nvim, storagePath)))
    subscriptions.push(sources.createSource(BibTexSource(storagePath)))
  }
}
