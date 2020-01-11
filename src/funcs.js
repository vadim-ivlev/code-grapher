import * as fs from 'fs'
import * as path from 'path'
import * as walker from './walker.js'

/** 
 * ### funcs
 * 
 * Structure to save information about functions.
 * 
 *      {
 *      'func1' = > [ {funcDescr}, {funcDescr},],
 *      'func2' = > [ {funcDescr}],
 *      'func3' = > [ {funcDescr}, {funcDescr}, {funcDescr},],
 *      }
 */
var funcs = new Map()


/** 
 * Match function declarations 
 * */
var funcDeclRegExp = /function\s+(\w+)\s*\(.*\)\s*\{/g

/** 
 * Match function declarations 
 * */
var funcCallRegExp = /(\w+)\s*\(/g


/**
 * Removes comments from text.
 * 
 * @param {string} string 
 * @returns cleaned text
 */
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
    for (let match of fileContent.matchAll(funcDeclRegExp) ){

        let funcDecl = match[0]
        let funcName = match[1]
        let bIndex = match.index + funcDecl.length

        let funcDescriptor = {
            funcName       : funcName,
            funcFullName   : filePath+":"+funcName,
            funcDeclaration: funcDecl,
            declIndex      : match.index,
            bodyIndex      : bIndex,
            funcCalls      : [],
            funcBody       : getFunctionBody(bIndex, match.input),
            fileName       : path.basename(filePath),
            fileExt        : path.extname(filePath),
            filePath       : filePath,
        }
        // set [] if necessary
        if (!funcs.get(funcName))  funcs.set(funcName,[])
        funcs.get(funcName).push(funcDescriptor)
    }
}


function getListOfFunctions(funcDescriptor) {
    let calledFunctions = []
    for (let match of funcDescriptor.funcBody.matchAll(funcCallRegExp) ){
        let funcName = match[1]

        if (funcName=='buildGraphData')
            console.warn('buildGraphData')

        let descriptors = funcs.get(funcName)
        if (!descriptors)  continue
        if (descriptors.length == 1){
            calledFunctions.push(descriptors[0].funcFullName)
            continue
        } else {
            for (let descriptor of descriptors) {
                if ( hasReferenceToFileName(funcDescriptor.filePath, descriptor.fileName))
                    calledFunctions.push(descriptor.funcFullName)
            }
        }
    }
    return calledFunctions
}

function hasReferenceToFileName(filePath, fileName) {
    //the same file
    if (path.basename(filePath) == fileName) return true

    const fileContent = removeComments(fs.readFileSync(filePath, 'utf8'))
    // TODO: analyze imports instead or use regexp at least
    return fileContent.includes(fileName)
}


function buildGraphData() {
    var linkCounter = 0
    var data = {nodes:[], links: []}
    // for each function body find called functions. TODO: define iterator here.
    // var descriptors = function* (){ for (let [funcName,funcDescriptors] of funcs.entries()) for (let d of funcDescriptors) yield d }
    // for (let f of descriptors()) {}

    for (let [funcName,funcDescriptors] of funcs.entries()) for (let descr of funcDescriptors) {

        let node = {
            name: descr.funcName,
            labels: [descr.filePath],
            identity: descr.funcFullName,
            descriptor: descr,
        }

        node.descriptor.funcCalls = getListOfFunctions(descr)
        data.nodes.push(node)
        
        for (let fun of node.descriptor.funcCalls) {
            let link = {
                identity: linkCounter++,
                start: node.identity,
                end: fun,
                types:['call'],
            }
            data.links.push(link)
        }
    }
    return data
}


// some stat
function printStat(funcs) {
    // console.warn('funcs=',funcs)
    console.warn('-'.repeat(55))

    var counter = 0
    let files = new Set()
    let functions = new Set()
    for (let [funcName,descriptors] of funcs.entries()){
        counter++
        let s1 = `${counter}. Function ${funcName}`.padEnd(40)
        let s2 = `defined ${descriptors.length} time` + (descriptors.length>1 ? 's':'')
        console.warn(s1 + s2)
        for (let d of descriptors) {
            files.add(d.filePath)
            functions.add(d.funcFullName)
        }
    }
    console.warn('-'.repeat(55))
    console.warn(`Total ${functions.size} functions defined in ${files.size} files.`)
    // console.warn( [...funcs.values()].reduce( (s,v) => s+=v.length, 0)  )
}


export function getGraphData(dirs, includePattern, excludePattern) {
    walker.walkDirs(dirs, buildFuncsMap, includePattern, excludePattern)
    printStat(funcs)
    var data = buildGraphData(funcs)
    return data
}
