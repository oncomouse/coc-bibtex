import { workspace } from 'coc.nvim'

interface CitationConfiguration {
  before: string,
  after: string,
}

const makeCitation = (id:string):string => {
  const config = workspace.getConfiguration('bibtex')
  const {before,after} = config.get<CitationConfiguration>('citation', {before: '[@', after: ']'})
  return `${before}${id}${after}`
}

export default makeCitation
