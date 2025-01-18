# Usamos como base la imagen oficial de LocalStack
FROM localstack/localstack:latest

# (Opcional) Instalar algo adicional dentro del contenedor:
# RUN apk add --no-cache curl jq

# Copiar algún script propio si lo necesitas
# COPY scripts/ /docker-entrypoint-initaws.d/

# Exponemos el puerto principal de LocalStack (se hace en la imagen base, pero a veces se repite)
EXPOSE 4566

# Definimos un entrypoint si necesitamos algo personalizado
# ENTRYPOINT ["docker-entrypoint.sh"]

# Comando por defecto (el CMD oficial de localstack/localstack corre LocalStack)
CMD ["docker-entrypoint.sh"]
