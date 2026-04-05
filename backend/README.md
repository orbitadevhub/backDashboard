# 🔐 Secure Authentication API – NestJS + JWT + Mandatory 2FA

<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<p align="center">
  Secure backend authentication API built with <strong>NestJS</strong>, implementing
  <strong>JWT</strong> and <strong>mandatory Two-Factor Authentication (2FA)</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-red" />
  <img src="https://img.shields.io/badge/Security-2FA%20Mandatory-green" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

---

## 📌 Overview

This project is a **production-grade authentication API** built with **Node.js and NestJS**, implementing:

* JWT-based authentication
* Mandatory Two-Factor Authentication (2FA)
* TOTP (RFC 6238)
* QR delivery via email (SMTP)

The authentication flow follows **corporate and regulated system standards**, commonly used in:

* Financial systems
* SOC platforms
* Critical infrastructure backends

---

## 🚀 Key Features

* User registration and login
* **Mandatory 2FA for all users**
* TOTP secret generation
* QR code generation and email delivery
* OTP validation
* Temporary JWT (2FA pending)
* Final JWT after OTP verification
* Route protection using Guards
* Modular and scalable NestJS architecture
* OWASP-aligned security practices

---

## 🧠 Authentication Architecture

Authentication is split into **two enforced steps**:

1. **Primary credentials** (email + password)
2. **Second factor** (OTP via authenticator app)

> ⚠️ No final JWT is issued until **both factors** are validated.

---

## 🔄 Authentication Flow

```
User Registration
        ↓
Login (email + password)
        ↓
Temporary JWT (2FA pending)
        ↓
OTP Verification
        ↓
Final JWT
        ↓
Access to protected endpoints
```

---

## 🔐 Main Endpoints

### Authentication

| Method | Endpoint                 | Description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| POST   | `/auth/register`         | User registration                           |
| POST   | `/auth/login`            | Initial login (returns temporary token)     |
| POST   | `/auth/2fa/setup`        | Generates TOTP secret and sends QR by email |
| POST   | `/auth/2fa/enable`       | Enables 2FA after OTP validation            |
| POST   | `/auth/2fa/verify-login` | Verifies OTP and issues final JWT           |

---

### 🔒 Protected Routes

All business endpoints require:

* Valid JWT
* Completed 2FA process

```ts
@UseGuards(JwtAuthGuard, TwoFactorGuard)
```

---

## 🛡️ Security Highlights

* Temporary JWT with expiration
* Final JWT only after OTP validation
* TOTP secrets never exposed via API
* QR sent via email as inline attachment (CID)
* Dedicated Guards for 2FA enforcement
* Clear separation between authentication and authorization

---

## 🧩 Tech Stack

* Node.js
* NestJS
* TypeScript
* JWT
* Passport.js
* Speakeasy (TOTP)
* Nodemailer (SMTP)
* QRcode
* Cloudinary
* Supabase

---

## ⚙️ Environment Variables

Create a `.env` file at project root:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=dfgdgdggr
GOOGLE_CALLBACK_URL=

MAIL_HOST=smtp.gmail.com
MAIL_PORT=564987
MAIL_SECURE=false
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_app_password

SUPABASE_URL=

FRONTEND_SUCCESS_URL=
IS_OFFLINE=

JWT_SECRET=

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS="[PASSWORD]"
DATABASE_NAME=postgres
DATABASE_URL="postgresql://postgres:[PASSWORD]@localhost:5432/postgres"

CLOUDINARY_CLOUD_NAME=jiknedf8
CLOUDINARY_API_KEY=823798729837493847
CLOUDINARY_API_SECRET=sdkflnsldkfnlsdnf
```

> ⚠️ Gmail **requires App Passwords** (regular passwords are not supported).

---

## ▶️ Installation & Run

```bash
pnpm install
pnpm start:dev
```

The API will be available at:

```
http://localhost:3000
```

---

## 🧪 Basic Testing

### Initial Login

```http
POST /auth/login
```

Response:

```json
{
  "twoFactorRequired": true,
  "tempToken": "JWT_TEMPORARY"
}
```

---

### OTP Verification

```http
POST /auth/2fa/verify-login
Authorization: Bearer <TEMP_TOKEN>
```

Body:

```json
{
  "code": "123456"
}
```

Response:

```json
{
  "accessToken": "JWT_FINAL"
}
```

---

## 📁 Project Structure (Simplified)

```
src/
├── auth/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
├── twofa/
│   ├── twofactor.controller.ts
│   ├── twofactor.service.ts
├── qremail/
│   ├── qremail.module.ts
│   ├── qremail.service.ts
├── users/
├── app.module.ts
```

---

## 🧠 Real-World Use Cases

This architecture is suitable for:

* Financial platforms
* Corporate systems
* Critical infrastructure
* SOC / SIEM platforms
* Regulated backends

---

## 🛣️ Roadmap

* Rate limiting for OTP attempts
* Authentication audit logs
* Refresh tokens
* Trusted device support
* 2FA reset and recovery flow


# 📄 Document Upload Service (NestJS + Supabase)

## 🧠 Overview

Este servicio permite subir archivos (PDF, DOC/DOCX) desde un cliente (frontend o Postman) hacia un backend desarrollado en NestJS, almacenarlos en **Supabase Storage**, y registrar su metadata en base de datos PostgreSQL.

---

## 🏗️ Arquitectura

```txt
Client (Frontend / Postman)
        ↓
NestJS Backend (FileInterceptor + Service)
        ↓
Supabase Storage (archivos)
        ↓
PostgreSQL (metadata NEONDB)
```

---

## 📁 Estructura 

```txt
/src
  /files
    files.controller.ts     # Endpoint HTTP
    files.module.ts         # Módulo de archivos

  /supabase
    supabase.service.ts     # Lógica de integración con Supabase
    supabase.module.ts      # Módulo global
    supabase.config.ts      # Configuración del cliente

  /config
    (env, cloudinary opcional)

main.ts
app.module.ts
```

---

## ⚙️ Componentes principales

### 📌 FilesController

Responsable de exponer el endpoint HTTP para subir archivos.

* Ruta: `POST /files/upload`
* Usa `FileInterceptor` (Multer)
* Recibe archivos tipo `multipart/form-data`

---

### 📌 SupabaseService

Encapsula la lógica de interacción con Supabase:

* Upload de archivos a Storage
* Generación de URLs firmadas
* Manejo de errores y retry

---

### 📌 Supabase Config

Inicializa el cliente de Supabase usando variables de entorno:

* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 Endpoint: Upload de documentos

### 🔗 URL

```http
POST /files/upload
```

---

### 📥 Request

**Content-Type:** `multipart/form-data`

| Campo | Tipo | Descripción            |
| ----- | ---- | ---------------------- |
| file  | File | Archivo PDF o DOC/DOCX |

---

### 📤 Response

```json
{
  "fileName": "uuid-nombre-original.pdf"
}
```

---

## 🔄 Flujo completo

1. El cliente envía un archivo usando `multipart/form-data`
2. NestJS intercepta el archivo con `FileInterceptor`
3. Se valida:

   * tipo MIME
   * tamaño
4. Se genera un nombre único (`UUID`)
5. El archivo se sube a Supabase Storage (bucket: `documents`)
6. Se guarda metadata en PostgreSQL:

   * nombre original
   * path
   * tipo MIME
   * tamaño
7. Se devuelve el identificador del archivo

---

## 🔐 Seguridad

* Validación de tipo de archivo (PDF/DOCX)
* Límite de tamaño (ej: 5MB)
* Uso de bucket privado
* Acceso mediante Signed URLs
* Variables sensibles manejadas por `.env`

---

## 📦 Variables de entorno

```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🧪 Testing

### Con Postman

* Método: `POST`
* URL: `http://localhost:3000/files/upload`
* Body → `form-data`

  * key: `file`
  * type: File

---

### Con curl

```bash
curl -X POST http://localhost:3000/files/upload \
  -F "file=@/ruta/archivo.pdf"
```

---

## ⚠️ Errores comunes

| Error            | Causa                        |
| ---------------- | ---------------------------- |
| 404 Not Found    | Módulo no importado          |
| Unexpected field | nombre incorrecto del campo  |
| Bucket not found | bucket no creado en Supabase |
| Missing env vars | variables no definidas       |

---

## 📈 Mejoras futuras

* Validación por magic numbers (anti spoofing)
* Integración con JWT (usuario autenticado)
* Upload directo con signed URL
* Logging centralizado
* Auditoría de accesos

---

## 🧠 Tecnologías

* NestJS
* Supabase Storage
* PostgreSQL
* Multer

---

## 📌 Estado

✔ Endpoint funcional
✔ Upload operativo
✔ Integración con Supabase completa

---

## 👨‍💻 Autor

Proyecto backend orientado a buenas prácticas, seguridad y arquitectura escalable.


---

## 👤 Author

**Martín**
Backend Engineer · NestJS · Security · Telecommunications

---

## 📄 License

MIT License – Free to use for educational and demonstrative purposes.
