# celutecnicos.com — CGC Triple Frontera 2026

Sitio oficial Paraguay del Circuit Global Championship 2026.
Tecnología: Next.js 15 + Supabase + Tailwind. Deploy: Vercel.

---

## 🚀 Cómo poner el sitio online (paso a paso para Kike)

> Vas a hacer 3 cosas: (1) sacar 2 secretos de Supabase, (2) subir el código a Vercel, (3) conectar tu dominio de GoDaddy. Tiempo total: 20 minutos.

---

### 📋 PARTE 1 — Sacar los 2 secretos de Supabase (2 min)

1. Abrí tu proyecto en https://supabase.com
2. En el menú izquierdo, abajo de todo, hacé click en el ícono de **engranaje** ⚙️ (**Project Settings**)
3. Dentro de Project Settings, click en **"API"** (o "API Keys")
4. Vas a ver 2 datos importantes. Copialos a un Bloc de notas, los vas a necesitar:

   | Lo que ves en Supabase | Lo voy a llamar |
   |------------------------|-----------------|
   | **Project URL** (algo como `https://abc123.supabase.co`) | URL |
   | **anon / public key** (un texto larguísimo que empieza con `eyJ...`) | ANON KEY |

   ⚠️ La que dice **`service_role`** ES SECRETA, **NO LA COPIES NI LA USES**. Es como la llave maestra de tu base de datos.

---

### 📋 PARTE 2 — Subir el código a Vercel (10 min)

#### 1. Crear cuenta en Vercel

- Andá a https://vercel.com/signup
- Click **"Continue with Email"** y usá `aguilera.enrique11@gmail.com`
- Confirmá el email que te llega

#### 2. Importar el proyecto

- Una vez logueado en Vercel: click **"Add New..."** (botón arriba a la derecha) → **"Project"**
- Vas a ver 2 opciones: importar desde Git o **"Continue with [..] / Deploy without a Git Repository"** — buscá esta segunda
- Te pide subir una carpeta. **Arrastrá la carpeta `celutecnicos` completa** al navegador
- Vercel detecta automáticamente que es Next.js. No toques nada.

#### 3. Configurar las variables de entorno (los 2 secretos)

- Antes de hacer click en Deploy, vas a ver una sección que dice **"Environment Variables"**
- Agregá estas 2:

  | Name (copiá exactamente) | Value |
  |--------------------------|-------|
  | `NEXT_PUBLIC_SUPABASE_URL` | El **URL** que copiaste de Supabase |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | El **ANON KEY** que copiaste de Supabase |

- Click **"Deploy"**
- Esperá 1-2 minutos. Vercel te muestra una pantalla con fuegos artificiales 🎉 cuando termina.

#### 4. Probá que funcione

- Vercel te da una URL temporal tipo `celutecnicos-abc123.vercel.app`. Abrila.
- Tenés que ver la landing del CGC Triple Frontera 2026.
- Probá registrarte → te creás tu cuenta → como tu email está en la lista de admins, automáticamente sos admin → vas a ver el menú "Admin" arriba.

---

### 📋 PARTE 3 — Conectar tu dominio celutecnicos.com (5 min)

#### 1. En Vercel

- Entrá al proyecto → **Settings** (arriba) → **Domains** (menú izquierdo)
- Escribí `celutecnicos.com` → **Add**
- Vercel te va a mostrar 2 opciones de configuración. Vas a ver algo como:

  ```
  Set the following record on your DNS provider:
  Type: A
  Name: @
  Value: 76.76.21.21
  ```

  Y abajo te pide hacer lo mismo con `www.celutecnicos.com`:
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

  **Anotá esos 2 valores** (la IP y el CNAME).

#### 2. En GoDaddy

- Login en https://godaddy.com
- Click en **My Products** (arriba a la derecha, tu nombre)
- Buscá `celutecnicos.com` → click **DNS** o el botón **"Manage DNS"**
- Vas a ver una lista de "DNS Records"
- Borrá los registros tipo **A** y tipo **CNAME** que tengan `@` o `www` como nombre (los que vienen por defecto de GoDaddy apuntando a su página de parking)
- Agregá los 2 nuevos:

  **Registro 1 (tipo A):**
  - Type: `A`
  - Name: `@`
  - Value: `76.76.21.21` (o el que te dio Vercel)
  - TTL: `600 seconds` (o 1 hour)

  **Registro 2 (tipo CNAME):**
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com` (o el que te dio Vercel)
  - TTL: `600 seconds`

- Guardá los cambios.

#### 3. Esperar la propagación DNS

- Volvé a Vercel → Domains. Vas a ver `celutecnicos.com` con un cartelito que dice "Pending..." o "Invalid Configuration"
- Esto tarda entre 10 minutos y 1 hora (a veces hasta 24 hs en casos raros). No es Vercel ni nuestra culpa, es como funciona internet.
- Cuando esté listo, Vercel emite automáticamente un certificado HTTPS gratis.
- Cuando veas el dominio en verde con ✓ → **¡celutecnicos.com está online!** 🎉

---

## 🛠️ Si querés correr el sitio en tu computadora (opcional, para desarrollo)

Solo si querés ver cómo se ve antes de subirlo o hacer cambios:

1. Instalá Node.js (versión 20+) desde https://nodejs.org
2. Abrí la terminal en la carpeta `celutecnicos`
3. Copiá el archivo `.env.local.example` a `.env.local` y rellenalo con tus secretos
4. Corré:
   ```bash
   npm install
   npm run dev
   ```
5. Abrí http://localhost:3000

---

## 🧰 ¿Qué hace cada parte del sitio?

| Página | URL | Quién la ve |
|--------|-----|-------------|
| Landing | `/` | Todos |
| El evento | `/evento` | Todos |
| Inscripción | `/inscripcion` | Solo logueados |
| Pago (con datos de transferencia) | `/pago/[id]` | Dueño de la inscripción |
| Mi cuenta | `/mi-cuenta` | Logueados |
| Login | `/auth/login` | Todos |
| Registro | `/auth/registro` | Todos |
| Admin (dashboard) | `/admin` | Solo admins |
| Admin → Pagos | `/admin/pagos` | Solo admins |
| Admin → Inscripciones | `/admin/inscripciones` | Solo admins |

---

## 🔁 Si necesitás cambiar algo después

- **Cambiar precios o categorías** → SQL en Supabase (o te armo un editor en V2)
- **Cambiar datos bancarios** → SQL update en `site_settings.bank_accounts`
- **Cambiar WhatsApp** → SQL update en `site_settings.whatsapp_number`
- **Agregar admin** → SQL: `update site_settings set value = '["email1","email2"]'::jsonb where key='admin_emails';`

Cuando quieras hacer cambios al CÓDIGO (diseño, agregar páginas, etc), volvés a este chat y los hacemos juntos.

---

## 💸 Flujo de pago (cómo funciona el cobro)

1. Técnico se inscribe → sistema genera código único `CGC-PY-0001`
2. Le muestra los datos: EKO + cuentas Banco Familiar
3. Hace la transferencia mencionando el código
4. Elige cómo mandar comprobante:
   - **Botón WhatsApp** → abre el chat con vos con todo el mensaje precargado
   - **Subir archivo** → sube foto/PDF al sitio y vos lo ves en admin
5. Vos entrás a `/admin/pagos`, mirás el comprobante, click **✓ Confirmar**
6. La inscripción pasa a "Confirmada" automáticamente

---

¡Listo! Cualquier duda, volvé al chat. 🚀
