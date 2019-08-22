import { workspace } from 'coc.nvim'
const cacheFullFilePaths = async function(): Promise<string[]> {
  const {nvim} = workspace
  const config = workspace.getConfiguration('list.source.bibtex')
  const files = config.get<string[]>('files', [])
  const output=[]
  if (files.length === 0) {
    workspace.showMessage('No .bib files provided; set list.source.bibtex to a list of .bib files')
  }
  for (let i = 0; i < files.length; i++) {
    const fullPath = await nvim.call('expand', files[i])
    output.push(fullPath)
  }
  return output
}

export default cacheFullFilePaths
