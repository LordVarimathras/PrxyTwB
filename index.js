const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuración de autenticación básica
const auth = { username: "usuario", password: "contraseña" };

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Basic " + Buffer.from(`${auth.username}:${auth.password}`).toString('base64')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send('Authentication required');
        return;
    }
    next();
});

// Middleware para redirigir todas las solicitudes a través del proxy
app.use('/', (req, res, next) => {
    // Obtén la URL de destino del encabezado de la solicitud
    const destinationUrl = req.headers['target_url'];
    
    if (!destinationUrl) {
        return res.status(400).send('Missing "target_url" header.');
    }

    // Configura el middleware de proxy para redirigir las solicitudes a la URL de destino
    createProxyMiddleware({
        target: destinationUrl,   // La URL de destino de la solicitud
        changeOrigin: true,       // Cambia el origen del host
        secure: false,            // Permite conexiones no seguras (HTTP)
    })(req, res, next);
});

// Iniciar el servidor proxy
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy en funcionamiento en puerto ${PORT}`);
});