import { Readable } from 'stream'
import fs from 'fs'

class CacheReader extends Readable {
  constructor(file:string) {
    super({})
    const cacheData = JSON.parse(fs.readFileSync(file).toString())
    cacheData.map(data => this.push(JSON.stringify(data)))
    this.push(null)
  }
}

export default CacheReader
