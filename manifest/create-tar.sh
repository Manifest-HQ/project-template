#!/bin/bash

# Command 1
rsync -av --progress ../ ./tmp/temp_directory/ --exclude node_modules/ --exclude app/.nuxt/ --exclude app/.node_modules/

# Command 2
tar -czvf ./manifest/heroku.tgz -C /tmp temp_directory/

# Command 3
rm -rf ./tmp/temp_directory/
