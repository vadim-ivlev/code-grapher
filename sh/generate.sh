#!/bin/bash

node src/graph.mjs -i '(\.sh|\.mjs)$' -x 'node' . > ../neo4j-grapher/public/data/files.json
