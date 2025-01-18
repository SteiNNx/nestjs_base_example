#!/bin/bash
# suit-wake-up-s3-local.sh
# Autor: Jorge Reyes

set -e  # Salir inmediatamente si un comando falla

# Incluir funciones de utilidad (init_docker_containers, log, etc.)
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
    # Carga todas las variables del .env al entorno actual
    export $(grep -v '^#' "$env_file" | xargs)
}

######################################
# Mostrar (log) las variables de entorno cargadas
######################################
log_loaded_env_vars() {
    log "==== Variables de entorno cargadas ===="
    log "EXTERNAL_API_MDR_S3_SUITE_PROJECT_NAME: ${EXTERNAL_API_MDR_S3_SUITE_PROJECT_NAME}"
    log "EXTERNAL_API_MDR_S3_ENDPOINT:          ${EXTERNAL_API_MDR_S3_ENDPOINT}"
    log "AWS_REGION:                            ${AWS_REGION}"
    log "========================================"
}

######################################
# Inicializar contenedores de S3 (LocalStack, MinIO, etc.)
######################################
init_s3_suite_containers() {
    init_docker_containers \
        "${EXTERNAL_API_MDR_S3_SUITE_PROJECT_NAME}" \
        "./scripts/docker/docker-compose-s3.yml" \
        "$1" \
        "S3 Iniciado." \
        "No se pudo iniciar S3. Verifica el archivo docker-compose."
}

######################################
# Crear un bucket de ejemplo en S3
######################################
create_s3_buckets() {
    local bucket="s3_mdr_files"

    log "Creando bucket '${bucket}' ..."
    aws --endpoint-url "${EXTERNAL_API_MDR_S3_ENDPOINT}" \
        s3 mb "s3://${bucket}" \
        --region "${AWS_REGION}" \
        --no-cli-pager

    log "Bucket '${bucket}' creado correctamente."
}

######################################
# (Opcional) Subir un archivo de ejemplo al bucket
######################################
seed_s3_data() {
    local test_file="doc/files/mdr_amex.data.txt"
    local bucket="s3_mdr_files"

    if [ ! -f "$test_file" ]; then
        log "No se encontró el archivo de ejemplo: $test_file"
        return
    fi

    log "Subiendo $test_file a ${bucket} ..."
    aws --endpoint-url "${EXTERNAL_API_MDR_S3_ENDPOINT}" \
        s3 cp "$test_file" "s3://${bucket}/" \
        --region "${AWS_REGION}" \
        --no-cli-pager

    log "Archivo subido correctamente a ${bucket}."
}

######################################
# Inicializar y sembrar S3
######################################
init_seed_s3_suite_containers() {
    create_s3_buckets
    seed_s3_data
}

######################################
# Función principal
######################################
main() {
    validate_environment
    source_env_vars ".env"
    log_loaded_env_vars  # <-- Nuevo llamado para mostrar variables cargadas
    init_s3_suite_containers "$1"
    init_seed_s3_suite_containers
    log "Inicialización de S3 completada exitosamente."
}

# Ejecutar función principal
main "$@"
