// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const SECRET = "ganado_secret"; // 👈 misma clave que en auth.js

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET); // 👈 ahora coinciden
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ mensaje: 'Token inválido' });
  }
};
