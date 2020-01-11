# Code Grapher
builds a graph of function calls and file references

### running

    node src/file-graph.mjs -i '(\.sh|\.mjs)$' -x 'node' . | ccat

## Generate files for neo4-grapher

    sh/generate.sh

```graphvis

digraph G {
    a -> {b,c,d}
    d->e

}

```

