import { workspace } from 'coc.nvim'
const cacheFullFilePaths = async (): Promise<string[]> => {
  const {nvim} = workspace
  const config = workspace.getConfiguration('list.source.bibtex')
  const files = config.get<string[]>('files', [])
  const output=[]
  if (files.length === 0) {
    workspace.showMessage('No .bib files provided; set list.source.bibtex to a list of .bib files')
  }
  for (const file of files) {
    const fullPath = await nvim.call('expand', file)
    output.push(fullPath)
  }
  return output
}

export default cacheFullFilePaths
