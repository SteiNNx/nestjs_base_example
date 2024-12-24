const express = require('express');
const app = express();
const port =  process.env.EXTERNAL_API_MONITOREO_PORT;

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal que recibe cualquier tipo de cuerpo de solicitud
app.all('*', (req, res) => {
    console.log('--- Nueva Solicitud Recibida ---');
    console.log(`Método: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log('Cuerpo de la Solicitud:');

    // Formatear y mostrar el cuerpo de la solicitud
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).send('Solicitud recibida y registrada.');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
