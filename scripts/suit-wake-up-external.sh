#!/bin/bash
# suit-wake-up-external.sh
# Autor: Jorge Reyes

set -e  # Salir inmediatamente si un comando falla

# Incluir funciones de utilidad
source scripts/commands/main.sh

######################################
# Definir la lista de servicios
######################################
SERVICES=("monitoreo_api" "sign_api")  # Añade más servicios aquí según sea necesario

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
    # Cargar variables de entorno desde el archivo .env
    export $(grep -v '^#' "$env_file" | xargs)
}

######################################
# Inicializar un servicio específico
######################################
init_service() {
    local service_name="$1"
    log "Inicializando ${service_name}..."

    # Navegar al directorio del servicio
    cd "external/${service_name}"

    # Instalar dependencias si no están instaladas
    if [ ! -d "node_modules" ]; then
        log "Instalando dependencias de ${service_name}..."
        npm install
    else
        log "Dependencias de ${service_name} ya están instaladas."
    fi

    # Iniciar el servidor del servicio en segundo plano
    log "Iniciando el servidor de ${service_name}..."
    nohup npm start > "${service_name}.log" 2>&1 &

    # Obtener el PID del último proceso en segundo plano
    SERVICE_PID=$!
    log "${service_name} iniciado con PID ${SERVICE_PID}."

    # Registra el PID en un archivo para uso futuro
    echo $SERVICE_PID > "${service_name}.pid"
    breakline

    # Volver al directorio raíz del proyecto
    cd ../../

    success "${service_name} se ha iniciado correctamente. Logs disponibles en external/${service_name}/${service_name}.log"
    breakline
}

######################################
# Función principal
######################################
main() {
    validate_environment
    source_env_vars ".env"

    for service in "${SERVICES[@]}"; do
        init_service "$service"
    done

    log "Inicialización de servicios externos completada exitosamente."
}

# Ejecutar función principal
main "$@"
