import fs from 'fs'
import {Readable} from 'stream'
import Cite from './vendor/citation-js'
import CacheInterface from './CacheInterface'
import BibTexEntry from './BibTexEntry'

class BibTeXReader extends Readable {
  constructor(file: string) {
    super({})
    const cacheFile = CacheInterface.cacheFilePath(file)
    const bibData = Cite.parse.bibtex.text(fs.readFileSync(file).toString())
    const output = []
    bibData.forEach((entry:BibTexEntry) => {
      const cite = (new Cite(entry, {})).format('bibliography', {append: entry => ` [${entry.id}]`})
      const data = {
        label: cite,
        filterText: entry.label,
        data: {
          cite: `@${entry.label}`,
          entry,
        }
      }
      this.push(JSON.stringify(data))
      output.push(data)
    })
    fs.writeFileSync(cacheFile, JSON.stringify(output))
    this.push(null)
  }
}
export default BibTeXReader
