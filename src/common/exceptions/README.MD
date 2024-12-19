import { BusinessError } from 'src/common/exceptions/business.exception';
import { TechnicalError } from 'src/common/exceptions/technical.exception';

// Caso 1: Error de negocio sin causa
throw new BusinessError('BUSINESS.001', 'Ocurrió un error de negocio inesperado.');

// Caso 2: Error de negocio con código de estado personalizado
throw new BusinessError('BUSINESS.002', 'El proceso de pago ha fallado.', 400);

// Caso 3: Error de negocio con causa
const causeError = new Error('Fallo en el servicio de pagos.');
throw new BusinessError('BUSINESS.003', 'Error al procesar la solicitud de pago.', 500, causeError);

// Caso 4: Error técnico sin causa
throw new TechnicalError('TECH.001', 'Ocurrió un error técnico inesperado.');

// Caso 5: Error técnico con código de estado personalizado
throw new TechnicalError('TECH.002', 'Error de conexión con el servidor.', 503);

// Caso 6: Error técnico con causa
const dbError = new Error('Timeout en el servicio de base de datos.');
throw new TechnicalError('TECH.003', 'Error al acceder a los datos.', 500, dbError);


### Caso 1: Error de negocio sin causa

```json
{
  "statusCode": 500,
  "code": "BUSINESS.001",
  "message": "Ocurrió un error de negocio inesperado.",
  "errors": [],
  "cause": undefined
}
```

### Caso 2: Error de negocio con código de estado personalizado

```json
{
  "statusCode": 400,
  "code": "BUSINESS.002",
  "message": "El proceso de pago ha fallado.",
  "errors": [],
  "cause": undefined
}
```

### Caso 3: Error de negocio con causa

```json
{
  "statusCode": 500,
  "code": "BUSINESS.003",
  "message": "Error al procesar la solicitud de pago.",
  "errors": [],
  "cause": {
    "code": "",
    "name": "Error",
    "message": "Fallo en el servicio de pagos.",
    "stack": "STACK_TRACE_DEL_ERROR_ORIGINAL"
  }
}
```

> Nota: `STACK_TRACE_DEL_ERROR_ORIGINAL` representará el stack trace real del error original, que será una cadena larga con la traza de la función.

### Caso 4: Error técnico sin causa

```json
{
  "statusCode": 500,
  "code": "TECH.001",
  "message": "Ocurrió un error técnico inesperado.",
  "errors": [],
  "cause": undefined
}
```

### Caso 5: Error técnico con código de estado personalizado

```json
{
  "statusCode": 503,
  "code": "TECH.002",
  "message": "Error de conexión con el servidor.",
  "errors": [],
  "cause": undefined
}
```

### Caso 6: Error técnico con causa

```json
{
  "statusCode": 500,
  "code": "TECH.003",
  "message": "Error al acceder a los datos.",
  "errors": [],
  "cause": {
    "code": "",
    "name": "Error",
    "message": "Timeout en el servicio de base de datos.",
    "stack": "STACK_TRACE_DEL_ERROR_ORIGINAL"
  }
}
```

De esta forma, el frontend recibirá un cuerpo JSON consistente con información sobre el error, el código HTTP, el código interno de error, un mensaje descriptivo, posibles errores adicionales en un arreglo `errors`, y una `cause` (causa) opcional con más contexto cuando corresponda.