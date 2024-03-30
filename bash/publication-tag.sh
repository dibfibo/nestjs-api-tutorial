#!/bin/bash

# check arguments

if [ -z "$1" ]; then
    echo "Error: Specify environment name."
    exit 1
fi

# define environment name
environment_name="$1"

# read project name
name=$(grep -o '"tag": *"[^"]*"' package.json | sed 's/"tag": "\(.*\)"/\1/')

# read project version
version=$(grep -o '"version": *"[^"]*"' package.json | sed 's/"version": "\(.*\)"/\1/')

# check project version
if [ -z "$version" ]; then
    echo "Error: Cannot find version in package.json file."
    exit 1
fi

# define commit message
message="$project_name - $version - $environment_name"

# stage changes
git add .

# commit changes
git commit -m "$message"

# timestamp
timestamp=$(date +"%Y%m%d%H%M%S")

# define tag name
tag="$project_name-$environment_name-$timestamp"

# create tag
git tag "$tag"

# push head with tags
git push origin HEAD --tags