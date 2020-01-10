#!/bin/bash

node src/graph.mjs -f -i '(\.sh|\.mjs)$' -x 'node' . > ../neo4j-grapher/public/data/funcs.json
