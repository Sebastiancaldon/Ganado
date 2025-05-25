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

### Seguridad General
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

#### Usando Jest 
Las pruebas automatizadas verifican:
- ✅ Protección contra acceso no autorizado a recursos
- ✅ Filtrado correcto en consultas masivas
- ✅ Prevención de modificación de recursos ajenos
- ✅ Validación de autorización en creación de recursos

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

---


## 🏆 Cumplimiento de Estándares

Este proyecto implementa protecciones contra las siguientes vulnerabilidades del **OWASP API Security Top 10 (2023)**:

- ✅ **API1:2023** - Broken Object Level Authorization

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
