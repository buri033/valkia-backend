# Valkia Coffee — Backend API REST

API REST robusta construida con **Node.js**, **Express**, **TypeScript**, **Prisma ORM** y **PostgreSQL (Supabase)**, implementando **Clean Architecture** (Arquitectura en 4 capas).

---

## Enlaces del Proyecto

- **Frontend en Vercel:** [https://valkia-coffee.vercel.app](https://valkia-coffee.vercel.app)
- **API Desplegada (Producción):** https://valkia-backend.onrender.com
- **Repositorio Frontend:** [https://github.com/buri033/valkia-frontend](https://github.com/buri033/valkia-frontend)
- **Repositorio Backend:** [https://github.com/buri033/valkia-backend](https://github.com/buri033/valkia-backend)

---

## Arquitectura en 4 Capas

El backend cumple con la separación estricta de responsabilidades:

```
src/
├── domain/                  # Capa de Dominio: Entidades y contratos de repositorios
│   ├── entities/            # User, Product, Interaction
│   └── repositories/        # IUserRepository, IProductRepository, IInteractionRepository
├── application/             # Capa de Aplicación: Casos de uso, DTOs y lógica de negocio
│   ├── dtos/                # AuthDTO, ProductDTO, InteractionDTO
│   ├── errors/              # AppError (400, 401, 403, 404, 409)
│   └── use-cases/           # Register, Login, Products CRUD, Interactions
├── infrastructure/          # Capa de Infraestructura: Prisma ORM y servicios externos
│   ├── prisma/              # prisma.client.ts (ÚNICO lugar donde vive Prisma), seed.ts
│   ├── repositories/        # PrismaUserRepository, PrismaProductRepository, PrismaInteractionRepository
│   └── security/            # BcryptPasswordHasher, JwtTokenService
└── interface/               # Capa de Interfaz: Controladores HTTP, routers y middlewares
    └── http/
        ├── controllers/     # AuthController, ProductController, InteractionController
        ├── middlewares/     # auth.middleware, role.middleware, error.middleware
        ├── routes/          # auth.routes, product.routes, interaction.routes
        └── app.ts           # Configuración de Express y CORS estricto
```

---

## Credenciales de Prueba (Seed)

Generadas por el seed con contraseñas encriptadas mediante `bcrypt`:

| Rol | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|
| **Administrador** | `admin@valkia.com` | `Admin123*` | Gestión total del catálogo (Crear, Editar, Eliminar productos) y ver todas las interacciones |
| **Usuario Normal** | `cliente@valkia.com` | `Cliente123*` | Ver catálogo paginado, registrar recomendaciones en el sommelier y consultar sus interacciones |

---

## Cómo Ejecutar en Local

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/buri033/valkia-backend.git
cd valkia-backend
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz basado en `.env.example`:
```env
PORT=4000
DATABASE_URL="postgresql://usuario:contrasena@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://usuario:contrasena@host:5432/postgres"
JWT_SECRET="valkia_coffee_super_secret_jwt_key_2026_specialty"
JWT_EXPIRES_IN="24h"
FRONTEND_URL="https://valkia-coffee.vercel.app"
```

### 3. Sincronizar Base de Datos y Ejecutar Seed
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
La API estará disponible en `http://localhost:4000/api`.

### 5. Ejecutar Pruebas Automatizadas
```bash
npm test
```

---

## Decisiones Técnicas

### 1. Flujo completo de un login
1. El usuario envía sus credenciales (`email` y `password`) desde el formulario del frontend mediante una petición `POST /api/auth/login`.
2. El `AuthController` delega la petición al caso de uso `LoginUseCase`.
3. El caso de uso consulta el usuario en PostgreSQL a través de `IUserRepository` (implementado por `PrismaUserRepository`).
4. Si el correo no existe o la contraseña no coincide al compararla con `bcrypt.compare`, la API lanza un `UnauthorizedError` que responde con código **401** y un mensaje genérico para no dar pistas a atacantes.
5. Si las credenciales son correctas, `JwtTokenService` firma un token JWT que incluye únicamente el `id` y el `role` en su payload (evitando información sensible), con tiempo de expiración configurable (`expiresIn: '24h'`).
6. El frontend almacena el token y lo adjunta en el encabezado `Authorization: Bearer <token>` en las siguientes peticiones HTTP.
7. Al acceder a una ruta protegida (ej: `POST /api/interaccion`), el `authMiddleware` valida la firma del token y extrae el usuario; posteriormente `roleMiddleware` valida los permisos antes de permitir el paso al controlador correspondiente.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?
En el frontend se almacena en `localStorage` (o cookies accesibles) para mantener la persistencia de la sesión activa al recargar la página o navegar entre pestañas.
- **Riesgo:** Si bien es muy conveniente para aplicaciones desacopladas, `localStorage` es vulnerable a ataques de tipo **XSS (Cross-Site Scripting)** si se llega a inyectar un script malicioso en la aplicación cliente. 
- **Mitigación:** Se sanitizan todas las entradas de usuario, se aplican encabezados estrictos y se limita el tiempo de vida del token mediante la expiración de 24 horas.

### 3. ¿En qué caso tu API responde 401 y en cuál 403? (Ejemplos reales del proyecto)
- **401 Unauthorized (Falta o invalidez de autenticación):** Ocurre cuando un cliente intenta acceder a una ruta protegida sin enviar el encabezado `Authorization`, o cuando el token está mal formado o expirado.  
  *Ejemplo real:* Un usuario sin sesión intenta registrar una interacción en `POST /api/interaccion` o eliminar un producto con `DELETE /api/catalogo/:id` sin token $\rightarrow$ La API responde **401 Unauthorized**.
- **403 Forbidden (Falta de autorización / permisos):** Ocurre cuando el usuario sí está autenticado y tiene un token válido, pero su rol no posee los privilegios necesarios para realizar la acción solicitada.  
  *Ejemplo real:* Un usuario autenticado con rol `user` (`cliente@valkia.com`) envía una petición para borrar un café con `DELETE /api/catalogo/prod-123` $\rightarrow$ El middleware de autenticación valida su token (es un usuario real), pero `soloAdmin` detecta que su rol no es `admin` y responde **403 Forbidden**.

### 4. Uso de Inteligencia Artificial
- **Para qué se usó:** Se utilizó para estructurar la plantilla inicial de la arquitectura en 4 capas según los patrones de diseño modernos, afinar la tipificación estricta de TypeScript en los filtros de paginación de Prisma y redactar casos de prueba automatizados.
- **Qué se tuvo que corregir:** Se debió ajustar la configuración de conexión de Prisma con Supabase para manejar el pooler IPv4 (`pgbouncer=true` y `directUrl`), corregir el tipado de `AuthenticatedRequest` en los controladores de Express sin recurrir a tipos `any`, y asegurar que el `userId` en las interacciones nunca se lea del cuerpo (`body`) sino exclusivamente del payload verificado del token JWT.

---

## Endpoints de la API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registro de usuario nuevo (hash bcrypt, rol user) |
| `POST` | `/api/auth/login` | Público | Inicio de sesión (emite JWT con expiración) |
| `GET` | `/api/auth/me` | Autenticado | Obtener datos del perfil actual |
| `GET` | `/api/catalogo` | Público | Listar productos con paginación `{ pagination, data }` |
| `GET` | `/api/catalogo/:id` | Público | Detalle de un producto por ID |
| `POST` | `/api/catalogo` | Solo Admin | Crear nuevo producto en el catálogo |
| `PUT` | `/api/catalogo/:id` | Solo Admin | Actualizar producto existente |
| `DELETE` | `/api/catalogo/:id` | Solo Admin | Eliminar producto del catálogo |
| `POST` | `/api/interaccion` | Autenticado | Crear interacción/pedido vinculado al token del usuario |
| `GET` | `/api/interaccion/mias` | Autenticado | Listar únicamente las interacciones del usuario en sesión |
| `GET` | `/api/interaccion` | Solo Admin | Listar todas las interacciones del sistema |
| `GET` | `/api/health` | Público | Health check de la API |
