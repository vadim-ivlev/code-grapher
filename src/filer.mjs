import * as fs from 'fs'
import * as path from 'path'
import * as walker from './walker.mjs'

var files = new Map()

function buildFileMap(filePath) {
    files.set(filePath,[])
}


function fillFileMap(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    for ( let f of files.keys()){
        const basename = path.basename(f)
        if (fileContents.includes(basename))
            files.get(filePath).push(f)
    }    
}


function buildGraphData() {
    var linkCounter = 0
    var data = {nodes:[], links: []}
    for (let f of files.keys()) {
        let node = {
            name: path.basename(f),
            identity: f,
            labels: [ path.extname(f)] ,
        }
        data.nodes.push(node)
        let linkedFiles = files.get(f)
        for (let file of linkedFiles) {
            let link = {
                identity: linkCounter++,
                start: f,
                end: file,
            }
            data.links.push(link)
        }
    }
    return data
}


export function getGraphData(dirs, includePattern, excludePattern) {

    walker.walkDirs(dirs, buildFileMap, includePattern, excludePattern)
    walker.walkDirs(dirs, fillFileMap, includePattern, excludePattern)

    var data = buildGraphData(files)
    return data
}
