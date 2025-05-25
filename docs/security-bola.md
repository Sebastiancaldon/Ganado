# Documentación de Seguridad - Protección contra Broken Object Level Authorization (BOLA)

## Descripción del Riesgo (API1:2023)

Broken Object Level Authorization (BOLA) es la vulnerabilidad número 1 en el OWASP API Security Top 10 (2023). Esta vulnerabilidad ocurre cuando una API no verifica adecuadamente que un usuario tiene los permisos necesarios para acceder a un objeto específico.

En el contexto de AgroTrack, esta vulnerabilidad podría permitir que un usuario:
- Vea ganado o registros de producción que pertenecen a otros usuarios
- Modifique ganado o registros de producción que pertenecen a otros usuarios
- Elimine ganado o registros de producción que pertenecen a otros usuarios

### Impacto Potencial

- **Violación de privacidad**: Exposición de datos sensibles de producción ganadera
- **Manipulación de datos**: Alteración no autorizada de registros de ganado y producción
- **Pérdida de datos**: Eliminación no autorizada de registros
- **Ventaja competitiva injusta**: Acceso a información de producción de otros ganaderos
- **Problemas legales**: Incumplimiento de regulaciones de protección de datos

## Soluciones Implementadas

### 1. Middleware de Autorización a Nivel de Objeto

Hemos implementado tres middlewares específicos para verificar la propiedad de los recursos:

- **verifyGanadoOwnership**: Verifica que un registro de ganado pertenezca al usuario autenticado
- **verifyProduccionOwnership**: Verifica que un registro de producción pertenezca a un animal del usuario autenticado
- **verifyAnimalOwnership**: Verifica que un animal pertenezca al usuario autenticado al crear/actualizar registros de producción

Estos middlewares se aplican a todas las rutas que manipulan recursos específicos (GET, PUT, DELETE por ID).

### 2. Filtrado Estricto en Consultas Masivas

En los endpoints que devuelven múltiples registros, hemos implementado filtros estrictos:

- **getAllGanado**: Filtra siempre por `usuarioId` para mostrar solo ganado del usuario autenticado
- **getAllProduccion**: Filtra por `animalId` usando solo IDs de animales que pertenecen al usuario autenticado
- **getReporteProduccion**: Genera reportes solo con datos de animales que pertenecen al usuario autenticado

### 3. Prevención de Transferencia de Propiedad

Hemos implementado medidas para evitar la transferencia de propiedad de recursos:

- No se permite actualizar el `usuarioId` en registros de ganado
- No se permite actualizar el `animalId` en registros de producción

### 4. Registro de Intentos de Acceso No Autorizado

Implementamos registro (logging) de intentos de acceso no autorizado para:
- Detectar posibles ataques
- Facilitar auditorías de seguridad
- Identificar patrones de comportamiento sospechoso

## Mejores Prácticas Implementadas

1. **Principio de menor privilegio**: Los usuarios solo pueden acceder a sus propios recursos
2. **Verificación en cada capa**: Implementamos controles tanto en rutas como en controladores
3. **Mensajes de error genéricos**: No revelamos información sensible en mensajes de error
4. **Uso de códigos de estado HTTP apropiados**: 403 Forbidden para intentos de acceso no autorizado
5. **Verificación basada en ID de usuario, no en tokens o roles**: Garantiza que incluso con un token válido, un usuario no puede acceder a recursos de otros

## Pruebas de Seguridad Recomendadas

Para verificar la efectividad de estas protecciones, se recomienda realizar las siguientes pruebas:

1. **Pruebas de acceso directo a objetos (IDOR)**:
   - Intentar acceder a un recurso de otro usuario modificando los IDs en las URL
   - Intentar modificar un recurso de otro usuario

2. **Pruebas de manipulación de parámetros**:
   - Intentar cambiar el `usuarioId` en solicitudes PUT
   - Intentar asignar producción a animales de otros usuarios

3. **Pruebas de fuerza bruta de IDs**:
   - Intentar acceder a recursos con IDs secuenciales o aleatorios

## Referencias

- [OWASP API Security Top 10 2023 - API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
- [OWASP Testing Guide - Testing for Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References)
