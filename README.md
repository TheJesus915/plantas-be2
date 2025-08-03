# Jardin Digital Backend

Repositorio del backend de la aplicación **Jardín Digital**, desarrollado con [NestJS](https://nestjs.com/) y [Prisma](https://www.prisma.io/).


### Configuración

1. **Clona el repositorio**
```bash
git clone https://github.com/lpalmadev/plantas-be.git
cd plantas-be
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
.env
```

Edita el archivo `.env` con tus configuraciones:
```env
# Base de datos
DATABASE_URL=""

# JWT
JWT_SECRET=""
JWT_EXPIRES_IN=""

# Email
MAIL_HOST=""
MAIL_PORT=
MAIL_USER=""
MAIL_PASS=""

# Aplicación
PORT=
```

4. **Configura la base de datos**
```bash
# Ejecuta las migraciones
npx prisma migrate dev

# Genera el cliente de Prisma
npx prisma generate
```

## Ejecución
```bash
# Modo desarrollo con hot reload
npm run start:dev

La aplicación estará disponible en `http://localhost:3000`


```

## Estructura del proyecto
```bash
src/
├── app.controller.ts        # Controlador principal
├── app.module.ts            # Módulo raíz de la aplicación
├── app.service.ts           # Servicio principal
├── main.ts                  # Punto de entrada
│
├── [modulos]/               # Módulos del sistema
│   ├── application/         # Casos de uso y DTOs
│   ├── domain/              # Entidades e interfaces
│   ├── infrastructure/      # Repositorios y servicios
│   ├── presentation/        # Controladores
│   └── *.module.ts          # Configuración de cada módulo
│
└── shared/                  # Módulo Compartido
    ├── infrastructure/      # Servicios globales (Prisma, Mail, etc.)
    └── shared.module.ts     # Configuración global
