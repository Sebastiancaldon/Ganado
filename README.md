# 🐄 Sistema de Gestión Ganadera

Este proyecto es un sistema de backend para registrar y hacer seguimiento del ganado, así como gestionar la producción de leche y carne. Está desarrollado en **Node.js**, utilizando **Express**, **Sequelize** y **MySQL**, con un menú interactivo en consola usando **Inquirer**.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- Sequelize ORM
- MySQL
- Inquirer (menú interactivo)
- JWT (para autenticación)
- Bcrypt (para encriptar contraseñas)

---

## 🛠️ Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura la base de datos:**

Edita el archivo `config/config.json` o `.env` si usas Sequelize con variables de entorno:

```json
{
  "development": {
    "username": "tu_usuario_mysql",
    "password": "tu_contraseña_mysql",
    "database": "ganado_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

4. **Crea la base de datos:**

```bash
npx sequelize db:create
```

5. **Ejecuta las migraciones:**

```bash
npx sequelize db:migrate
```

6. **(Opcional) Carga datos de ejemplo (seeders):**

```bash
npx sequelize db:seed:all
```

---

## 🏃‍♀️ Ejecución del backend

```bash
npm start
```

Esto iniciará el backend y cargará el **menú interactivo** en consola con **Inquirer**, permitiéndote:

- Iniciar sesión
- Registrar ganado
- Registrar producción (leche/carne)
- Consultar y actualizar registros
- Ver producción filtrada por usuario

---

## 🧪 Pruebas

> ⚠️ Las pruebas se realizan **a través del menú interactivo de la consola**

### Funcionalidades a probar desde el menú:

1. **Inicio de sesión con usuario registrado**
2. **Registro y consulta de animales**
3. **Asociación de animales al usuario autenticado**
4. **Registro de producción solo para animales del usuario**
5. **Visualización de producción del usuario autenticado**

---

## 🔐 Autenticación

- Las contraseñas se almacenan cifradas usando **bcrypt**.
- El sistema usa **JWT** para proteger las rutas del backend y asegurar que solo usuarios autenticados puedan acceder.

---

## 📁 Estructura del proyecto

```
├── models/             # Modelos de Sequelize
├── controllers/        # Lógica de negocio
├── routes/             # Rutas protegidas y públicas
├── config/             # Configuración de Sequelize
├── database/           # Migraciones y seeders
├── middlewares/        # Autenticación y validaciones
├── menu.js     # Menú interactivo en consola
├── app.js              # Configuración de Express
├── index.js            # Punto de entrada
└── README.md           # Este archivo
```

---

## 🤝 Créditos

Desarrollado por AGRO-TRACK y equipo como parte del proyecto académico de Ingenieria de software II - 2025.
