import * as fs from 'fs'
import * as path from 'path'
import * as walker from './walker.mjs'
import parseArgs from 'minimist'
// import glob from 'glob'

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
            labels: [ path.extname(f)] ,
            identity: f,
            basename: path.basename(f),
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
    var argv = parseArgs(process.argv.slice(2));
    console.warn('argv=',argv)

    if (argv._.length==0) {
        console.warn("Please specify root dir as the first param.")
        return
    }

    walker.walkDirs(argv._, buildFileMap, argv.i, argv.x)
    walker.walkDirs(argv._, fillFileMap,  argv.i, argv.x)

    var data = buildGraphData(files)
    var dataStr = JSON.stringify(data, null, 2)
    console.log(dataStr)
    
}

main()

// console.log('firstDir=',firstDir)
// var options = {
//     "ignore":['*node_modules/**']
// }
// glob("**", options, function (er, files) {
//     // files is an array of filenames.
//     // If the `nonull` option is set, and nothing
//     // was found, then files is ["**/*.js"]
//     // er is an error object or null.
//     console.log("err=",er)
//     console.log("files=",files)
//   })