#!/bin/bash
# stop-external.sh
# Autor: Jorge Reyes

# Función para detener monitoreo_api
stop_monitoreo_api() {
    local pid_file="external/monitoreo_api/monitoreo_api.pid"

    if [ -f "$pid_file" ]; then
        API_PID=$(cat "$pid_file")
        echo "Deteniendo monitoreo_api con PID ${API_PID}..."
        kill $API_PID
        rm "$pid_file"
        echo "monitoreo_api detenido."
    else
        echo "No se encontró el archivo monitoreo_api.pid. ¿Está monitoreo_api corriendo?"
    fi
}

######################################
# Función principal
######################################
main() {
    stop_monitoreo_api
    echo "Servicios externos han sido detenidos exitosamente."
}

# Ejecutar función principal
main
