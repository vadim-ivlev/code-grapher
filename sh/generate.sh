#!/bin/bash

node src/file-graph.mjs -i '(\.sh|\.mjs)$' -x 'node' . > ../neo4j-grapher/public/data/files.json
