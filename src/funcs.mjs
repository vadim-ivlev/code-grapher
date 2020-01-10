import * as fs from 'fs'
import * as path from 'path'
import * as walker from './walker.mjs'

var funcs = new Map()
var funcRegExp = /function\s+(\w+)\s*\(.*\)\s*\{/g

function removeComments(text) {
    var lines = text.split('\n')
    var cleanedLines = []
    for (let line of lines){
        let cLine = line.replace(/\/\/.*/g,'')
        cleanedLines.push(cLine)
    }
    var cleanedText = cleanedLines.join('\n')
    return cleanedText
}

function getFunctionBody(bodyIndex, text) {
    var tail = text.slice(bodyIndex)
    var bracketCounter = 1
    var i =0
    while (i<tail.length) {
        let c = tail[i]
        if (c == '{') bracketCounter ++
        if (c == '}') bracketCounter --
        if (bracketCounter == 0) break
        i++    
    }

    return tail.substr(0, i)
}


function buildFuncsMap(filePath) {
    const fileContent = removeComments(fs.readFileSync(filePath, 'utf8'))
    for (let match of fileContent.matchAll(funcRegExp) ){
        let funcDecl = match[0]
        let funcName = match[1]
        let bIndex = match.index + funcDecl.length
        let funcDescriptor = {
            name : funcName,
            fullName: filePath+":"+funcName,
            funcDeclaration: funcDecl,
            declIndex: match.index,
            bodyIndex: bIndex,
            funcCalls:[],
            // funcBody: match.input.substr(bIndex, getBodyLength(bIndex, match.input)),
            funcBody: getFunctionBody(bIndex, match.input),
        }
        funcs.set(funcName, funcDescriptor)
    }
    console.warn('funcs=', funcs)
}


// function fillFuncsMap(filePath) {
//     const fileContents = fs.readFileSync(filePath, 'utf8')
//     for ( let f of funcs.keys()) {
//         const basename = path.basename(f)
//         if (fileContents.includes(basename))
//             funcs.get(filePath).push(f)
//     }    
// }


function buildGraphData() {
    var linkCounter = 0
    var data = {nodes:[], links: []}
    for (let f of funcs.keys()) {
        let node = {
            name: path.basename(f),
            identity: f,
            labels: [ path.extname(f)] ,
        }
        data.nodes.push(node)
        let linkedFiles = funcs.get(f)
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

    walker.walkDirs(dirs, buildFuncsMap, includePattern, excludePattern)
    // walker.walkDirs(dirs, fillFuncsMap, includePattern, excludePattern)

    // var data = buildGraphData(funcs)
    return null
}
