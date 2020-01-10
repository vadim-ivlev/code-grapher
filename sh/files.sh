#!/bin/bash

node src/graph.js -i '(\.sh|\.mjs|\.js)$' -x 'node' . > ../neo4j-grapher/public/data/files.json
