#!/bin/bash

# Controlla se è stato fornito il nome dell'ambiente come argomento
if [ -z "$1" ]; then
    echo "Errore: specificare il nome dell'ambiente come argomento dello script."
    exit 1
fi

# Recupera il nome del progetto
project_name="cms"

# Recupera il nome dell'ambiente
environment_name="$1" # Imposta manualmente o recupera da una variabile

# Crea il messaggio
message="$project_name - pubblicazione in $environment_name"

# stage changes
git add .

# commit changes
git commit -m "$message"

# Genera timestamp
timestamp=$(date +"%Y%m%d%H%M%S")

# Crea il nome del tag
tag="$project_name-$environment_name-$timestamp"

# Crea il tag
git tag "$tag"

# Pusha il tag
git push origin HEAD --tags