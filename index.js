const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuración de autenticación básica
const auth = { username: "user", password: "pass" };

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Basic " + Buffer.from(`${auth.username}:${auth.password}`).toString('base64')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send('Authentication required');
        return;
    }
    next();
});

// Configurar proxy a una URL de destino
app.use('/', createProxyMiddleware({
    target: 'https://example.com', // Cambia esto por la URL que quieras redirigir
    changeOrigin: true
}));

// Iniciar el servidor
app.listen(3000, () => console.log('Proxy funcionando en puerto 3000'));