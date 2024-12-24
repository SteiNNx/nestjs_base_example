#!/bin/bash
# stop-external.sh
# Autor: Jorge Reyes

set -e  # Salir inmediatamente si un comando falla

# Incluir funciones de utilidad
source scripts/commands/main.sh

######################################
# Definir la lista de servicios
######################################
SERVICES=("monitoreo_api" "sign_api")  # Añade más servicios aquí según sea necesario

######################################
# Función para detener un servicio específico
######################################
stop_service() {
    local service_name="$1"
    local pid_file="external/${service_name}/${service_name}.pid"

    if [ -f "$pid_file" ]; then
        SERVICE_PID=$(cat "$pid_file")
        log "Deteniendo ${service_name} con PID ${SERVICE_PID}..."

        # Verificar si el proceso está corriendo
        if ps -p "$SERVICE_PID" > /dev/null 2>&1; then
            kill "$SERVICE_PID"
            log "${service_name} detenido."
        else
            log "Proceso con PID ${SERVICE_PID} no está corriendo."
        fi

        # Eliminar el archivo PID
        rm -f "$pid_file"
        breakline
    else
        info "No se encontró el archivo ${service_name}.pid en external/${service_name}. ¿Está ${service_name} corriendo?"
    fi
}

######################################
# Función principal
######################################
main() {
    for service in "${SERVICES[@]}"; do
        stop_service "$service"
    done

    success "Servicios externos han sido detenidos exitosamente."
}

# Ejecutar función principal
main "$@"
