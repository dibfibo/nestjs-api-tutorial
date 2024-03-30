#!/bin/bash

# check arguments
if [ -z "$1" ]; then
    echo "Errore: specificare il nome dell'progetto come argomento dello script."
    exit 1
fi

if [ -z "$2" ]; then
    echo "Errore: specificare il nome dell'ambiente come argomento dello script."
    exit 1
fi

# define project name
project_name="$1"

# define environment name
environment_name="$2"

# read project version
version=$(grep -o '"version": *"[^"]*"' package.json | sed 's/"version": "\(.*\)"/\1/')

# check project version
if [ -z "$version" ]; then
    echo "Errore: impossibile trovare la versione nel file package.json."
    exit 1
fi

# define commit message
message="$project_name - $version - pubblicazione in $environment_name"

# stage changes
git add .

# commit changes
git commit -m "$message"

# timestamp
timestamp=$(date +"%Y%m%d%H%M%S")

# define commit message
tag="$project_name-$environment_name-$timestamp"

# create tag
git tag "$tag"

# push head with tags
git push origin HEAD --tags