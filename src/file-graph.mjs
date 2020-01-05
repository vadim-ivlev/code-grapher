import * as fs from 'fs'
import * as path from 'path'
import {walkDir} from './walker.mjs'

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
            identity: f,
            basename: path.basename(f),
            ext: path.extname(f),
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


function main(dir) {
    if (!dir) {
        console.log("Please specify root dir as the first param.")
        return
    }

    walkDir(dir, buildFileMap)
    walkDir(dir, fillFileMap)

    var data = buildGraphData(files)
    var dataStr = JSON.stringify(data, null, 2)
    console.log(dataStr)
    
}

main(process.argv[2])