#!/bin/bash

# Define the root directory
ROOT_DIR="$(dirname $(dirname $(realpath $0)))"

# Temporary directory for rsync
TMP_DIR="$ROOT_DIR/tmp/temp_directory"

# Ensure the temporary directory exists
mkdir -p "$TMP_DIR"

# Command 1: rsync to copy excluding the specified folders
rsync -av --progress "$ROOT_DIR/" "$TMP_DIR/" --exclude .git/ --exclude node_modules/ --exclude app/.nuxt/ --exclude app/.node_modules/

# Command 2: Create the tarball
tar -czvf "$ROOT_DIR/manifest/heroku.tgz" -C "$TMP_DIR" .

# Command 3: Cleanup
rm -rf "$TMP_DIR"
