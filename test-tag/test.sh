#!/bin/bash

# Recupera il nome del progetto
project_name="project_name"

# Recupera il nome dell'ambiente
environment_name="environment_name" # Imposta manualmente o recupera da una variabile

# Genera timestamp
timestamp=$(date +"%Y%m%d%H%M%S")

# Crea il tag
git tag "$project_name-$environment_name-$timestamp"

# Pusha il tag
git push origin "$project_name-$environment_name-$timestamp"