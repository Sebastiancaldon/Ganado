# 🐄 AgroTrack - Sistema de Gestión Ganadera con Seguridad API

Este proyecto es un sistema de backend robusto y seguro para registrar y hacer seguimiento del ganado, así como gestionar la producción de leche y carne. Está desarrollado en **Node.js**, utilizando **Express**, **Sequelize** y **MySQL**, con implementación de las mejores prácticas de seguridad según **OWASP API Security Top 10**.

---

## 🚀 Tecnologías utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Sequelize ORM** - Mapeo objeto-relacional
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Bcrypt** - Encriptación de contraseñas
- **Helmet** - Protección de encabezados HTTP
- **Express Rate Limit** - Limitación de tasa de solicitudes
- **Swagger UI** - Documentación interactiva de la API
- **Jest** - Framework de pruebas
- **Supertest** - Pruebas de API

---

## 🔐 Características de Seguridad Implementadas

### API1:2023 - Protección contra Broken Object Level Authorization (BOLA)
- ✅ **Middleware de autorización a nivel de objeto** que verifica la propiedad de recursos
- ✅ **Filtrado estricto** en consultas masivas por usuario autenticado
- ✅ **Prevención de transferencia de propiedad** de recursos entre usuarios
- ✅ **Registro de intentos de acceso no autorizado** para auditoría
- ✅ **Pruebas automatizadas** para verificar la protección BOLA

### API4:2023 - Protección contra Consumo de Recursos Sin Restricciones
- ✅ **Rate limiting** diferenciado por tipo de endpoint
- ✅ **Limitación del tamaño del payload** (100KB máximo)
- ✅ **Validación de profundidad de objetos JSON** (10 niveles máximo)
- ✅ **Protección contra ataques DoS**

### Seguridad General
- ✅ **Encabezados HTTP seguros** con Helmet
- ✅ **Autenticación JWT** robusta
- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **Validación de entrada** en todos los endpoints
- ✅ **Manejo seguro de errores** sin exposición de información sensible

---

## 🛠️ Instalación

1. **Clona el repositorio:**

\`\`\`bash
git clone https://github.com/tu_usuario/agrotrack-api.git
cd agrotrack-api
\`\`\`

2. **Instala las dependencias:**

\`\`\`bash
npm install
\`\`\`

3. **Configura las variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto:

\`\`\`env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos
DB_USERNAME=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=agrotrack_db
DB_HOST=127.0.0.1

# Base de datos para pruebas
DB_TEST_NAME=agrotrack_test_db

# JWT Secret (usa una clave segura en producción)
JWT_SECRET=tu_clave_secreta_muy_segura
\`\`\`

4. **Crea las bases de datos:**

\`\`\`bash
# Base de datos principal
npx sequelize db:create

# Base de datos de pruebas
npx sequelize db:create --env test
\`\`\`

5. **Ejecuta las migraciones:**

\`\`\`bash
# Migración principal
npx sequelize db:migrate

# Migración de pruebas
npx sequelize db:migrate --env test
\`\`\`

---

## 🏃‍♀️ Ejecución

### Modo Desarrollo
\`\`\`bash
npm run dev
\`\`\`

### Modo Producción
\`\`\`bash
npm start
\`\`\`

El servidor se iniciará en `http://localhost:3000` y la documentación Swagger estará disponible en `http://localhost:3000/api-docs`.

---

## 🧪 Pruebas

### Pruebas Automatizadas

\`\`\`bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas de seguridad BOLA
npx jest tests/objectLevelAuth.test.js

# Ejecutar pruebas con cobertura
npm run test:coverage
\`\`\`

### Pruebas de Seguridad API

#### Usando Jest (Recomendado)
Las pruebas automatizadas verifican:
- ✅ Protección contra acceso no autorizado a recursos
- ✅ Filtrado correcto en consultas masivas
- ✅ Prevención de modificación de recursos ajenos
- ✅ Validación de autorización en creación de recursos

#### Usando Postman
1. Importa la colección de Postman (disponible en `/docs/postman/`)
2. Configura el entorno con las variables necesarias
3. Ejecuta las pruebas de seguridad en el siguiente orden:
   - Crear usuarios de prueba
   - Crear recursos con cada usuario
   - Intentar acceso no autorizado (debe fallar con 403)
   - Verificar filtrado correcto

#### Usando cURL/PowerShell
Consulta la documentación detallada en `/docs/security-testing.md` para comandos específicos.

---

## 📊 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Gestión de Ganado
- `GET /api/ganado` - Listar ganado del usuario autenticado
- `GET /api/ganado/:id` - Obtener ganado específico (solo si pertenece al usuario)
- `POST /api/ganado` - Crear nuevo registro de ganado
- `PUT /api/ganado/:id` - Actualizar ganado (solo si pertenece al usuario)
- `DELETE /api/ganado/:id` - Eliminar ganado (solo si pertenece al usuario)

### Gestión de Producción
- `GET /api/produccion` - Listar producción del usuario autenticado
- `GET /api/produccion/:id` - Obtener producción específica (solo si pertenece al usuario)
- `POST /api/produccion` - Crear registro de producción (solo para animales propios)
- `PUT /api/produccion/:id` - Actualizar producción (solo si pertenece al usuario)
- `DELETE /api/produccion/:id` - Eliminar producción (solo si pertenece al usuario)
- `GET /api/produccion/reporte` - Generar reporte de producción

### Documentación
- `GET /api-docs` - Documentación interactiva Swagger

---

## 🔒 Límites de Seguridad

### Rate Limiting
- **Autenticación**: 30 solicitudes por 15 minutos
- **API General**: 100 solicitudes por 5 minutos
- **Endpoints Sensibles**: 50 solicitudes por 10 minutos

### Limitaciones de Payload
- **Tamaño máximo**: 100KB por solicitud
- **Profundidad máxima**: 10 niveles de anidamiento en JSON

---

## 🧪 Verificación de Seguridad

### Pruebas BOLA (Broken Object Level Authorization)

Para verificar que la protección contra BOLA funciona correctamente:

1. **Crea dos usuarios diferentes**
2. **Crea recursos (ganado/producción) con cada usuario**
3. **Intenta acceder a recursos del otro usuario** - Debe devolver 403 Forbidden
4. **Verifica que las consultas masivas solo muestran recursos propios**

### Indicadores de Protección Exitosa
- ✅ Código de respuesta 403 al intentar acceso no autorizado
- ✅ Mensaje: "No tiene autorización para acceder a este recurso"
- ✅ Logs de seguridad registrando intentos no autorizados
- ✅ Filtrado correcto en endpoints de listado

---

## 📁 Estructura del proyecto

\`\`\`
├── controllers/           # Lógica de negocio
│   ├── authController.js
│   ├── ganadoController.js
│   └── produccionController.js
├── middlewares/          # Middlewares de seguridad
│   ├── auth.js          # Autenticación JWT
│   ├── objectLevelAuth.js # Protección BOLA
│   ├── rateLimiter.js   # Limitación de tasa
│   └── payloadLimiter.js # Limitación de payload
├── models/              # Modelos de Sequelize
│   ├── usuario.js
│   ├── ganado.js
│   ├── produccion.js
│   └── index.js
├── routes/              # Rutas de la API
│   ├── auth.js
│   ├── ganado.js
│   └── produccion.js
├── tests/               # Pruebas automatizadas
│   ├── auth.test.js
│   ├── ganado.test.js
│   ├── produccion.test.js
│   ├── objectLevelAuth.test.js
│   └── setup.js
├── docs/                # Documentación
│   ├── security.md
│   ├── security-bola.md
│   └── api-documentation.md
├── config/              # Configuración
│   └── database.js
├── migrations/          # Migraciones de base de datos
├── swagger.json         # Documentación OpenAPI
├── app.js              # Configuración de Express
├── server.js           # Punto de entrada
└── README.md           # Este archivo
\`\`\`

---

## 🔍 Monitoreo y Logs

### Eventos de Seguridad Registrados
- Intentos de acceso no autorizado a recursos
- Violaciones de rate limiting
- Payloads que exceden los límites establecidos
- Intentos de autenticación fallidos

### Ubicación de Logs
Los logs de seguridad se muestran en la consola del servidor y pueden configurarse para enviarse a sistemas de monitoreo externos.

---

## 🚀 Despliegue en Producción

### Variables de Entorno Requeridas
\`\`\`env
NODE_ENV=production
PORT=3000
DB_USERNAME=usuario_produccion
DB_PASSWORD=contraseña_segura
DB_NAME=agrotrack_prod
DB_HOST=host_base_datos
JWT_SECRET=clave_jwt_muy_segura_y_larga
\`\`\`

### Consideraciones de Seguridad
- Usar HTTPS en producción
- Configurar firewall para limitar acceso a la base de datos
- Implementar rotación de claves JWT
- Configurar monitoreo de logs de seguridad
- Realizar auditorías de seguridad regulares

---

## 📚 Documentación Adicional

- [Documentación de Seguridad BOLA](./docs/security-bola.md)
- [Documentación de Rate Limiting](./docs/security.md)
- [Guía de Pruebas de Seguridad](./docs/security-testing.md)
- [Documentación de la API](http://localhost:3000/api-docs)

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Ejecuta las pruebas (`npm test`)
4. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Crea un Pull Request

### Estándares de Seguridad
- Todas las nuevas funcionalidades deben incluir pruebas de seguridad
- Seguir las mejores prácticas de OWASP API Security Top 10
- Documentar cualquier nueva vulnerabilidad identificada y su mitigación

---

## 🏆 Cumplimiento de Estándares

Este proyecto implementa protecciones contra las siguientes vulnerabilidades del **OWASP API Security Top 10 (2023)**:

- ✅ **API1:2023** - Broken Object Level Authorization
- ✅ **API4:2023** - Unrestricted Resource Consumption
- 🔄 **Próximamente**: Implementación de protecciones adicionales

---

## 📞 Soporte

Para reportar vulnerabilidades de seguridad o problemas relacionados con la protección BOLA:

- Crea un issue en GitHub con la etiqueta `security`
- Incluye pasos detallados para reproducir el problema
- Proporciona logs relevantes (sin información sensible)


### Características de Seguridad
Implementación de protecciones contra vulnerabilidades OWASP API Security Top 10, con enfoque especial en:
- Broken Object Level Authorization (BOLA)
- Unrestricted Resource Consumption
- Mejores prácticas de autenticación y autorización

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🔄 Changelog

### v2.0.0 - Implementación de Seguridad API
- ✅ Protección contra Broken Object Level Authorization (BOLA)
- ✅ Rate limiting y limitación de payload
- ✅ Middleware de autorización a nivel de objeto
- ✅ Pruebas automatizadas de seguridad
- ✅ Documentación completa de seguridad

### v1.0.0 - Versión Base
- ✅ CRUD básico para ganado y producción
- ✅ Autenticación JWT
- ✅ Documentación Swagger
- ✅ Pruebas básicas

---

## 🤝 Créditos

Desarrollado por **AGRO-TRACK** y equipo como parte del proyecto académico de **Ingeniería de Software II - 2025**.
