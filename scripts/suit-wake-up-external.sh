#!/bin/bash
# wake-up-external.sh
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
# Inicializar Servicios Externos (monitoreo_api)
######################################
init_external_apis() {
    echo "Inicializando monitoreo_api..."

    # Navegar al directorio de monitoreo_api
    cd external/monitoreo_api

    # Instalar dependencias si no están instaladas
    if [ ! -d "node_modules" ]; then
        echo "Instalando dependencias de monitoreo_api..."
        npm install
    else
        echo "Dependencias de monitoreo_api ya están instaladas."
    fi

    # Iniciar el servidor de monitoreo_api en segundo plano
    echo "Iniciando el servidor de monitoreo_api..."
    nohup npm start > monitoreo_api.log 2>&1 &

    # Obtener el PID del último proceso en segundo plano
    API_PID=$!
    echo "monitoreo_api iniciado con PID ${API_PID}."

    # Registra el PID en un archivo para uso futuro (opcional)
    echo $API_PID > monitoreo_api.pid

    # Volver al directorio raíz del proyecto
    cd ../../..

    # Verificar que el servidor está corriendo
    check_monitoreo_api
}

######################################
# Verificar que monitoreo_api está corriendo
######################################
check_monitoreo_api() {
    local retries=5
    local wait=2
    local port=3000

    while ! nc -z localhost $port; do
        retries=$((retries-1))
        if [ $retries -le 0 ]; then
            echo "monitoreo_api no se inició correctamente."
            exit 1
        fi
        echo "Esperando a que monitoreo_api inicie..."
        sleep $wait
    done
    echo "monitoreo_api está corriendo en el puerto ${port}."
}

######################################
# Función principal
######################################
main() {
    validate_environment
    source_env_vars ".env"
    init_external_apis
    echo "Inicialización de servicios externos completada exitosamente."
}

# Ejecutar función principal
main "$@"
