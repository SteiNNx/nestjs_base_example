# Ejemplos de Uso de Excepciones Personalizadas

A continuación encontrarás **ejemplos de uso** de **todas las clases** de error personalizadas, incluyendo:
- BusinessError
- TechnicalError
- AdapterError
- ValidationError
- BadRequestError
- InternalError

Cada una **hereda** de `BaseError` y comparte la misma **estructura de respuesta JSON**, variando el `code`, `statusCode` y la `name` interna.

---

## Importación de las Excepciones

```ts
import { BusinessError } from 'src/common/exceptions/business.exception';
import { TechnicalError } from 'src/common/exceptions/technical.exception';
import { AdapterError } from 'src/common/exceptions/adapter.exception';
import { ValidationError } from 'src/common/exceptions/validation.exception';
import { BadRequestError } from 'src/common/exceptions/bad-request.exception';
import { InternalError } from 'src/common/exceptions/internal.exception';
```

---

## Ejemplos

### Caso 1: **BusinessError** sin causa
```ts
throw new BusinessError('BUSINESS.001', 'Ocurrió un error de negocio inesperado.');
```
**Respuesta JSON:**
```json
{
  "statusCode": 500,
  "code": "BUSINESS.001",
  "message": "Ocurrió un error de negocio inesperado.",
  "errors": [],
  "cause": undefined
}
```

### Caso 2: **BusinessError** con código de estado personalizado
```ts
throw new BusinessError('BUSINESS.002', 'El proceso de pago ha fallado.', 400);
```
**Respuesta JSON:**
```json
{
  "statusCode": 400,
  "code": "BUSINESS.002",
  "message": "El proceso de pago ha fallado.",
  "errors": [],
  "cause": undefined
}
```

### Caso 3: **BusinessError** con causa
```ts
const causeError = new Error('Fallo en el servicio de pagos.');
throw new BusinessError('BUSINESS.003', 'Error al procesar la solicitud de pago.', 500, causeError);
```
**Respuesta JSON:**
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
> Nota: `STACK_TRACE_DEL_ERROR_ORIGINAL` será el stack trace real del error.

---

### Caso 4: **TechnicalError** sin causa
```ts
throw new TechnicalError('TECH.001', 'Ocurrió un error técnico inesperado.');
```
**Respuesta JSON:**
```json
{
  "statusCode": 500,
  "code": "TECH.001",
  "message": "Ocurrió un error técnico inesperado.",
  "errors": [],
  "cause": undefined
}
```

### Caso 5: **TechnicalError** con código de estado personalizado
```ts
throw new TechnicalError('TECH.002', 'Error de conexión con el servidor.', 503);
```
**Respuesta JSON:**
```json
{
  "statusCode": 503,
  "code": "TECH.002",
  "message": "Error de conexión con el servidor.",
  "errors": [],
  "cause": undefined
}
```

### Caso 6: **TechnicalError** con causa
```ts
const dbError = new Error('Timeout en el servicio de base de datos.');
throw new TechnicalError('TECH.003', 'Error al acceder a los datos.', 500, dbError);
```
**Respuesta JSON:**
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

---

### Caso 7: **AdapterError** (por ejemplo, problema con servicio externo)
```ts
const externalServiceError = new Error('El servicio de mensajería respondió con 503');
throw new AdapterError('ADAPTER.001', 'Fallo en la comunicación con el servicio de mensajería.', 502, externalServiceError);
```
**Respuesta JSON:**
```json
{
  "statusCode": 502,
  "code": "ADAPTER.001",
  "message": "Fallo en la comunicación con el servicio de mensajería.",
  "errors": [],
  "cause": {
    "code": "",
    "name": "Error",
    "message": "El servicio de mensajería respondió con 503",
    "stack": "STACK_TRACE_DEL_ERROR_ORIGINAL"
  }
}
```

---

### Caso 8: **ValidationError** (ej. datos de dominio inválidos)
```ts
const validationIssues = [
  { field: 'email', message: 'Formato de email inválido.' },
  { field: 'age', message: 'La edad debe ser mayor o igual a 18.' }
];
throw new ValidationError('VALIDATION.001', 'Datos de entrada no válidos.', 422, undefined, validationIssues);
```
**Respuesta JSON:**
```json
{
  "statusCode": 422,
  "code": "VALIDATION.001",
  "message": "Datos de entrada no válidos.",
  "errors": [
    { "field": "email", "message": "Formato de email inválido." },
    { "field": "age", "message": "La edad debe ser mayor o igual a 18." }
  ],
  "cause": undefined
}
```

---

### Caso 9: **BadRequestError** (petición mal formada)
```ts
throw new BadRequestError('BAD_REQUEST.001', 'JSON mal formateado en la petición.', 400);
```
**Respuesta JSON:**
```json
{
  "statusCode": 400,
  "code": "BAD_REQUEST.001",
  "message": "JSON mal formateado en la petición.",
  "errors": [],
  "cause": undefined
}
```

---

### Caso 10: **InternalError** (error interno inesperado)
```ts
throw new InternalError('INTERNAL.001', 'Error interno no previsto en el servidor.');
```
**Respuesta JSON:**
```json
{
  "statusCode": 500,
  "code": "INTERNAL.001",
  "message": "Error interno no previsto en el servidor.",
  "errors": [],
  "cause": undefined
}
```
