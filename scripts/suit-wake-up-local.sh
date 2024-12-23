#!/bin/bash
# wake-up-local.sh
# Autor: Jorge Reyes

set -e  # Salir inmediatamente si un comando falla

# Incluir funciones de utilidad
source scripts/commands/main.sh

######################################
# Validar y cargar variables de entorno
######################################
validate_environment() {
    if [ ! -f ".env" ]; then
        echo "Archivo .env no encontrado. Abortando."
        exit 1
    fi
}

source_env_vars() {
    local env_file="$1"
    export $(grep -v '^#' "$env_file" | xargs)
}

######################################
# Inicializar contenedores de DynamoDB
######################################
init_dynamodb_suite_containers() {
    init_docker_containers \
        "${DYNAMODB_SUITE_PROJECT_NAME}" \
        "./scripts/docker/docker-compose-dynamodb.yml" \
        "$1" \
        "DynamoDB Iniciado." \
        "No se pudo iniciar DynamoDB. Verifica el archivo docker-compose."
}

######################################
# Crear tablas en DynamoDB
# Se asume que tienes archivos .structure.json
######################################
create_dynamodb_tables() {
    declare -a tables=("payments" "users" "merchants")

    for table in "${tables[@]}"; do
        local structure_file="doc/dynamodb/data/${table}.structure.json"
        if [ ! -f "$structure_file" ]; then
            echo "No se encontró el archivo de estructura: $structure_file"
            exit 1
        fi

        echo "Creando tabla '${table}' desde ${structure_file} ..."
        aws dynamodb create-table \
            --cli-input-json file://"$structure_file" \
            --endpoint-url "${DYNAMODB_ENDPOINT}" \
            --no-cli-pager \
            --region "${AWS_REGION}"

        echo "Tabla '${table}' creada correctamente."
    done
}

######################################
# Cargar datos semilla en DynamoDB
# Se asume que tienes archivos .data.json
######################################
seed_dynamodb_datas() {
    declare -a tables=("payments" "users" "merchants")

    for table in "${tables[@]}"; do
        local data_file="doc/dynamodb/data/${table}.data.json"
        if [ ! -f "$data_file" ]; then
            echo "No se encontró el archivo de datos: $data_file"
            exit 1
        fi

        echo "Cargando datos de semilla en la tabla '${table}' desde ${data_file} ..."
        aws dynamodb batch-write-item \
            --request-items file://"$data_file" \
            --endpoint-url "${DYNAMODB_ENDPOINT}" \
            --no-cli-pager \
            --region "${AWS_REGION}"

        echo "Datos de semilla para '${table}' cargados correctamente."
    done
}

######################################
# Inicializar y sembrar DynamoDB
######################################
init_seed_dynamodb_suite_containers() {
    create_dynamodb_tables
    seed_dynamodb_datas
}

######################################
# Función principal
######################################
main() {
    validate_environment
    source_env_vars ".env"
    init_dynamodb_suite_containers "$1"
    init_seed_dynamodb_suite_containers
    echo "Inicialización de DynamoDB completada exitosamente."
}

# Ejecutar función principal
main "$@"
