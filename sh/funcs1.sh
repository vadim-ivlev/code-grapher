#!/bin/bash

node src/graph.js -f -i '(\.html|\.mjs|\.js)$' -x 'node' ../neo4j-grapher/public > ../neo4j-grapher/public/data/funcs1.json
