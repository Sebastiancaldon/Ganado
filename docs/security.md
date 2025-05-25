# Documentación de Seguridad - AgroTrack API

## Implementación de Protección contra API4:2023 - Consumo de Recursos Sin Restricciones

### Descripción del Riesgo

El consumo de recursos sin restricciones (API4:2023 en OWASP API Security Top 10) ocurre cuando una API no implementa límites adecuados en los recursos que un cliente puede solicitar. Esto puede llevar a:

- Ataques de denegación de servicio (DoS)
- Consumo excesivo de recursos del servidor
- Degradación del rendimiento para todos los usuarios
- Aumento de costos operativos
- Interrupción del servicio

### Soluciones Implementadas

#### 1. Rate Limiting

Hemos implementado límites de tasa (rate limiting) para restringir el número de solicitudes que un cliente puede hacer en un período de tiempo específico:

- **Rutas de autenticación**: 30 solicitudes por 15 minutos
- **Rutas generales**: 100 solicitudes por 5 minutos
- **Rutas sensibles** (producción): 50 solicitudes por 10 minutos

El rate limiting se basa en la dirección IP del cliente y, si está autenticado, también en su ID de usuario, lo que proporciona una capa adicional de protección.

#### 2. Limitación del Tamaño del Payload

Hemos implementado restricciones en el tamaño y la complejidad de los datos que los clientes pueden enviar:

- **Límite de tamaño**: 100KB máximo para cualquier solicitud
- **Límite de profundidad**: Máximo 10 niveles de anidamiento en objetos JSON
- **Validación de estructura**: Verificación de la complejidad de los datos enviados

#### 3. Protección de Encabezados HTTP

Utilizamos el middleware Helmet para establecer encabezados HTTP seguros, lo que ayuda a proteger la aplicación contra varios tipos de ataques.

### Beneficios de la Implementación

1. **Protección contra DoS**: Limita el impacto de los ataques de denegación de servicio.
2. **Uso equitativo de recursos**: Garantiza que ningún cliente pueda monopolizar los recursos del servidor.
3. **Estabilidad del sistema**: Mantiene el rendimiento y la disponibilidad del sistema incluso bajo carga.
4. **Detección temprana**: Identifica patrones de abuso antes de que causen daños significativos.
5. **Cumplimiento de mejores prácticas**: Alineación con las recomendaciones de seguridad de OWASP.

### Configuración y Personalización

Los límites implementados pueden ajustarse según las necesidades específicas del entorno de producción:

- Modificar los valores en `middlewares/rateLimiter.js` para ajustar los límites de tasa
- Ajustar el tamaño máximo del payload en `middlewares/payloadLimiter.js`
- Configurar opciones adicionales de Helmet en `app.js` según sea necesario

### Pruebas de Seguridad

Para verificar la efectividad de estas protecciones, se recomienda realizar pruebas de carga y pruebas de penetración específicas:

1. Intentar realizar más solicitudes que el límite permitido
2. Enviar payloads de gran tamaño o con estructuras muy anidadas
3. Simular ataques de denegación de servicio

### Referencias

- [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Helmet JS](https://helmetjs.github.io/)
