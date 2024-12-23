#!/bin/bash
# stop-external.sh
# Autor: Jorge Reyes

set -e  # Salir inmediatamente si un comando falla

######################################
# Validar y cargar variables de entorno (Opcional)
######################################
# Si el script de detención también depende de variables de entorno, descomenta las siguientes funciones.
# validate_environment() {
#     if [ ! -f ".env" ]; then
#         echo "Archivo .env no encontrado. Abortando."
#         exit 1
#     fi
# }
# 
# source_env_vars() {
#     local env_file="$1"
#     # Cargar variables de entorno desde el archivo .env
#     export $(grep -v '^#' "$env_file" | xargs)
# }

######################################
# Función para detener monitoreo_api
######################################
stop_monitoreo_api() {
    local pid_file="external/monitoreo_api/monitoreo_api.pid"

    if [ -f "$pid_file" ]; then
        API_PID=$(cat "$pid_file")
        echo "Deteniendo monitoreo_api con PID ${API_PID}..."

        # Verificar si el proceso está corriendo
        if ps -p "$API_PID" > /dev/null 2>&1; then
            kill "$API_PID"
            echo "monitoreo_api detenido."
        else
            echo "Proceso con PID ${API_PID} no está corriendo."
        fi

        # Eliminar el archivo PID
        rm -f "$pid_file"
    else
        echo "No se encontró el archivo monitoreo_api.pid. ¿Está monitoreo_api corriendo?"
    fi
}

######################################
# Función principal
######################################
main() {
    # Si necesitas validar el entorno y cargar variables de entorno, descomenta las siguientes líneas.
    # validate_environment
    # source_env_vars ".env"

    stop_monitoreo_api
    echo "Servicios externos han sido detenidos exitosamente."
}

# Ejecutar función principal
main "$@"
