#!/bin/bash
# suit-wake-up-local.sh
# Autor: Jorge Reyes
#
# Descripción:
# Este script valida el entorno de Docker/Docker Compose, permite limpiar
# contenedores (y volúmenes), inicializarlos y, de forma opcional, mostrar
# su estado (aunque, de momento, la función de estado no realiza ninguna
# operación). Se asume la existencia de ficheros con definiciones de tablas
# y datos de semilla para DynamoDB.
#
# Dependencias:
# - Docker instalado y en ejecución.
# - Docker Compose instalado.
# - El archivo .env en la raíz del proyecto.

set -e  # Salir inmediatamente si un comando falla

# Incluir funciones de utilidad
source scripts/commands/main.sh

######################################
# Validar y cargar variables de entorno
######################################
validate_environment() {
    if [ ! -f ".env" ]; then
        log "Archivo .env no encontrado. Abortando."
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
    declare -a tables=("payments" "users" "merchants" "mdr_amex" "mdr_discover" "mdr_mastercard" "mdr_visa" "mdr_payments_mdr_applied")

    for table in "${tables[@]}"; do
        local structure_file="doc/dynamodb/data/${table}.structure.json"
        if [ ! -f "$structure_file" ]; then
            log "No se encontró el archivo de estructura: $structure_file"
            exit 1
        fi

        log "Creando tabla '${table}' desde ${structure_file} ..."
        aws dynamodb create-table \
            --cli-input-json file://"$structure_file" \
            --endpoint-url "${DYNAMODB_ENDPOINT}" \
            --no-cli-pager \
            --region "${AWS_REGION}"

        log "Tabla '${table}' creada correctamente."
    done
}

######################################
# Cargar datos semilla en DynamoDB
# Se asume que tienes archivos .data.json
######################################
seed_dynamodb_datas() {
    declare -a tables=("payments" "users" "merchants" "mdr_amex" "mdr_discover" "mdr_mastercard" "mdr_visa" "mdr_payments_mdr_applied")

    for table in "${tables[@]}"; do
        local data_file="doc/dynamodb/data/${table}.data.json"
        if [ ! -f "$data_file" ]; then
            log "No se encontró el archivo de datos: $data_file"
            exit 1
        fi

        log "Cargando datos de semilla en la tabla '${table}' desde ${data_file} ..."
        aws dynamodb batch-write-item \
            --request-items file://"$data_file" \
            --endpoint-url "${DYNAMODB_ENDPOINT}" \
            --no-cli-pager \
            --region "${AWS_REGION}"

        log "Datos de semilla para '${table}' cargados correctamente."
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
# Función para estado de contenedores
# Invoca el método status_docker_containers
######################################
status_dynamodb_suite_containers() {
    # Llama al método status_docker_containers que se encarga
    # de mostrar el estado detallado de los contenedores
    status_docker_containers \
        "${DYNAMODB_SUITE_PROJECT_NAME}" \
        "./scripts/docker/docker-compose-dynamodb.yml"
}

######################################
# Función principal
######################################
main() {
    validate_environment
    source_env_vars ".env"

    # Si se llama con el argumento '--status', invocamos la función y salimos
    if [[ "$1" == "--status" ]]; then
        status_dynamodb_suite_containers
        exit 0
    fi

    init_dynamodb_suite_containers "$1"
    init_seed_dynamodb_suite_containers
    log "Inicialización de DynamoDB completada exitosamente."
}

# Ejecutar función principal
main "$@"
