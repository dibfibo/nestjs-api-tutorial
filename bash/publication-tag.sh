#!/bin/bash

# check arguments
if [ -z "$1" ]; then
    echo "Error: Specify project name."
    exit 1
fi

if [ -z "$2" ]; then
    echo "Error: Specify environment name."
    exit 1
fi

# define project name
project_name="$1"

# define environment name
environment_name="$2"

# read project version
echo "$(grep -o '"version": *"[^"]*"' package.json)"
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