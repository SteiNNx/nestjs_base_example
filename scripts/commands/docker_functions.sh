#!/bin/bash
# Autor: Jorge Reyes

# Validar Docker y Docker Compose
validate_environment() {
    warning "Validando Docker y Docker Compose..."
    breakline
    validate_docker_and_compose
    info "Validación completa."
    breakline
}

# Función para validar Docker y Docker Compose
validate_docker_and_compose() {
    # Validar Docker
    if ! command -v docker &>/dev/null; then
        critical_error "Docker no está instalado. Instálalo antes de continuar."
        return
    fi

    case "$OSTYPE" in
        linux-gnu*)
            systemctl is-active --quiet docker || critical_error "Docker no está activo. Inícialo antes de continuar."
            ;;
        darwin*)
            pgrep -x "Docker" >/dev/null || critical_error "Docker no está activo. Inícialo antes de continuar."
            ;;
        msys*)
            docker info >/dev/null 2>&1 || critical_error "Docker no está activo. Inícialo antes de continuar."
            ;;
        *)
            critical_error "Sistema operativo no compatible."
            return
            ;;
    esac

    # Validar Docker Compose
    if ! command -v docker-compose &>/dev/null; then
        critical_error "docker-compose no está instalado. Consulta la documentación para instalarlo."
        return
    fi

    # Mensaje de éxito si todo está correcto
    info "Docker y docker-compose están instalados y funcionando correctamente."
    breakline
}

# Limpiar contenedores y volúmenes
cleanup_docker() {
    local project_name="$1"
    local build_flag="$2"
    local compose_file="$3"
    warning "Iniciando limpieza de contenedores..."
    breakline
    if [ "$build_flag" == "--build" ]; then
        # Limpiar contenedores, volúmenes y orfanatos
        docker-compose -p "${project_name}" -f "${compose_file}" down --volumes --remove-orphans
        info "Contenedores, volúmenes y orfanatos limpiados."
    else
        # Limpiar solo contenedores
        docker-compose -p "${project_name}" -f "${compose_file}" down
        info "Contenedores limpiados."
    fi
    breakline
}

# Inicializar contenedores usando docker-compose
init_docker_containers() {
    local project_name="$1"
    local compose_file="$2"
    local build_flag="$3"
    local success_message="$4"
    local failure_message="$5"

    warning "Iniciando contenedores de ${project_name}..."
    breakline
    cleanup_docker "$project_name" "$build_flag" "$compose_file"
    docker-compose -p "${project_name}" -f "${compose_file}" up ${build_flag} -d || {
        critical_error "${failure_message}"
    }
    breakline
    success "${success_message}"
    breakline
}
