import fs from 'fs'
import path from 'path'
import { homedir } from 'os'
import {createHash} from 'crypto'

class CacheInterface {
  private static cachePath = path.join(homedir(),'.config', 'coc', 'extensions', 'bibtex', '.cache')
  private static fileHash(filename:string, algorithm = 'md5'):string {
    return createHash(algorithm).update(filename).digest("hex")
  }
  private static createCacheDirectory() {
    if(!fs.existsSync(CacheInterface.cachePath)) {
      fs.mkdirSync(CacheInterface.cachePath, { recursive: true });
    }
  }
  public static cacheFilePath(file:string):string {
    CacheInterface.createCacheDirectory()
    const hash = CacheInterface.fileHash(file)
    return path.join(CacheInterface.cachePath, hash) 
  }
}

export default CacheInterface
