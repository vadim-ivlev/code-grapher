import parseArgs from 'minimist'
import * as filer from './filer.mjs'


// graph.mjs 
//
// The program parses command line parameters and prints out JSON importable by neo4j-grapher.
// Command line parameters:
// -f --function
//      build a function call graph
//
// -i 'regexp1'
//      include paths that match regexp1. 
//
// -x 'regexp2'
//      exclude paths that match regexp2
//
// -i precedes -x. In other words, first -i selects paths matching regexp1 from all possible subpaths, 
// and then -x excludes paths matching regexp2 from the rest.
//
// Example:
//      node src/graph.mjs -i '(\.sh|\.mjs)$' -x 'node_modules' . 
//
//      .  Analyse files in current directory and all its sub directories.
//      -i Include only files ending with .sh and .mjs 
//      -x Exclude files in directory node_modules and its sub directories.


function main(dir) {
    var argv = parseArgs(process.argv.slice(2));
    console.warn('argv=',argv)

    if (argv._.length==0) {
        console.warn("Please specify root dir as the first unnamed param.")
        return
    }

    var data = argv.f ? 
        console.warn('not implemented') 
        : 
        filer.getGraphData(argv._, argv.i, argv.x)

    var dataStr = JSON.stringify(data, null, 2)
    console.log(dataStr)    
}

main()
