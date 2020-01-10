#!/bin/bash

node src/graph.js -f -i '(\.sh|\.mjs|\.js)$' -x 'node' . > ../neo4j-grapher/public/data/funcs.json
