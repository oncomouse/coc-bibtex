import fs from 'fs'
import path from 'path'
import {createHash} from 'crypto'

class CacheInterface {
  /* private static cachePath = path.join(process.env.COC_DATA_HOME, 'extensions', 'bibtex', '.cache') */
  private static fileHash(filename:string, algorithm = 'md5'):string {
    // Build in last known change:
    return createHash(algorithm).update(filename + fs.statSync(filename).mtime).digest("hex")
  }
  /* private static createCacheDirectory():void { */
  /*   if(!fs.existsSync(CacheInterface.cachePath)) { */
  /*     fs.mkdirSync(CacheInterface.cachePath, { recursive: true }) */
  /*   } */
  /* } */
  public static cacheFilePath(storagePath:string, file:string):string {
    /* CacheInterface.createCacheDirectory() */
    const hash = CacheInterface.fileHash(file)
    return path.join(storagePath, hash)
  }
}

export default CacheInterface
