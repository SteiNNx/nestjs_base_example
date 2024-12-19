#!/bin/bash
# suit-dynamodb-local.sh
# Autor: Jorge Reyes

set -e # Salir inmediatamente si un comando falla

# Incluir funciones de utilidad
source scripts/commands/main.sh

# Validar y cargar variables de entorno
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

# Inicializar los contenedores de DynamoDB
init_dynamodb_suite_containers() {
    init_docker_containers \
        "${DYNAMODB_SUITE_PROJECT_NAME}" \
        "./scripts/docker/docker-compose-dynamodb.yml" \
        "$1" \
        "DynamoDB Iniciado." \
        "No se pudo iniciar DynamoDB. Verifica el archivo docker-compose."
}

# Crear tabla en DynamoDB utilizando la estructura definida
create_dynamodb_table() {
    echo "Creando tabla DynamoDB desde doc/dynamodb/data/payments.structure.json..."

    aws dynamodb create-table \
        --cli-input-json file://doc/dynamodb/data/payments.structure.json \
        --endpoint-url ${DYNAMODB_ENDPOINT} \
        --no-cli-pager \
        --region ${AWS_REGION}

    echo "Tabla DynamoDB creada correctamente."
}

# Cargar datos semilla en DynamoDB utilizando batch-write-item
seed_dynamodb_data() {
    echo "Cargando datos de semilla en la tabla payments desde doc/dynamodb/data/payments.data.json..."

    aws dynamodb batch-write-item \
        --request-items file://doc/dynamodb/data/payments.data.json \
        --endpoint-url ${DYNAMODB_ENDPOINT} \
        --no-cli-pager \
        --region ${AWS_REGION}

    echo "Datos de semilla cargados correctamente."
}

# Inicializar DynamoDB y cargar datos semilla
init_seed_dynamodb_suite_containers() {
    create_dynamodb_table
    seed_dynamodb_data
}

# Función principal
main() {
    validate_environment
    source_env_vars ".env"
    init_dynamodb_suite_containers "$1"
    init_seed_dynamodb_suite_containers # Invocación para crear la tabla y cargar datos
}

# Ejecutar función principal
main "$@"
