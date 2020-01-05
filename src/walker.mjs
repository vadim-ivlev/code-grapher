import * as fs from 'fs'
import * as path from 'path'

export function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f)
        let isDirectory = fs.statSync(dirPath).isDirectory()
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f))
    })
}
