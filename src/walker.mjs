import * as fs from 'fs'
import * as path from 'path'

/**
 * Recursively walks subdirectories of dir
 * and executes callback for each file that should be processed.
 * 
 * @param dir 
 * @param callback 
 * @param includeReg 
 * @param excludeReg 
 */
export function walkDir(dir, callback, includeReg, excludeReg) {
    // skip non directories
    if (!fs.statSync(dir).isDirectory()) return
    
    // if (! shoudBeProcessed(dir, null, excludeReg)) return
    
    fs.readdirSync(dir).forEach( f => {
        // skip dot files
        if (f[0]=='.') return 
        
        let dirPath = path.join(dir, f)
        // if directory go inside
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback, includeReg, excludeReg) 

        } 
        // check if the file should be processed
        else if (shoudBeProcessed(dirPath, includeReg, excludeReg)) {
            console.warn("filePath=", dirPath)
            callback(dirPath)
        }        
    })
}


/**
 * traverse list of directories.
 * @param dirs 
 * @param callback function to call for each processable file
 * @param includePattern reg expression pattern to include paths
 * @param excludePattern reg expression pattern to exclude paths 
 */
export function walkDirs(dirs, callback, includePattern, excludePattern) {
    var includeReg = includePattern? new RegExp(includePattern) : null
    var excludeReg = excludePattern? new RegExp(excludePattern) : null

    for (let dir of dirs){
        walkDir(dir, callback, includeReg, excludeReg)
    }
}

/**  
 * Checks if the file should be processed
 * @param f a path to check 
 * @param includeReg reg expression to include paths. 
 * @param excludeReg reg expression to exclude paths. 
 */
function shoudBeProcessed(f, includeReg, excludeReg) {
    if (!f) return false
    if ( includeReg && (!includeReg.test(f)) ) return false
    if ( excludeReg && excludeReg.test(f) ) return false
    return true
}
    
