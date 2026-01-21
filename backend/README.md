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

---

## ⚙️ Environment Variables

Create a `.env` file at project root:

```env
PORT=3000

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=15m

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_email@gmail.com
MAIL_PASS=gmail_app_password
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

---

## 👤 Author

**Martín**
Backend Engineer · NestJS · Security · Telecommunications

---

## 📄 License

MIT License – Free to use for educational and demonstrative purposes.
