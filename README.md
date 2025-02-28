# Electron React Starter

🚀 A starter template for building **Electron** applications with **React** and **TypeScript**.

## 📦 Features

- ⚡ **Electron** for cross-platform desktop app development
- ⚛ **React** for UI development
- 🛠 **TypeScript** for type safety
- 🎨 **MUI (Material UI)** for modern styling
- 🔄 **Hot Reloading** via Vite
- 📄 **ESLint & Prettier** for code quality
- 📑 **SQL Execution & History Tracking** (if applicable)

---

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/leewinter/electron-react-starter.git
cd electron-react-starter
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Run the App

```sh
npm run dev
```

### 4️⃣ Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### 5️⃣ Sign

#### Generate a Self-Signed Certificate

You'll need to create a self-signed code signing certificate using PowerShell.

Open PowerShell as Administrator.

Run the following command to create a self-signed certificate:

```powershell
New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=MySelfSignedCert" -KeyUsage DigitalSignature -CertStoreLocation "Cert:\CurrentUser\My"
```

This will generate a new self-signed certificate and store it in the Personal Certificates store.

Export the certificate:

- Open Certificate Manager (certmgr.msc).
- Go to Personal > Certificates.
- Find the certificate you just created (Issued To: MySelfSignedCert).
- Right-click > All Tasks > Export....
- Choose Yes, export the private key.
- Select .PFX format and set a password.
- Save the .pfx file somewhere safe.

#### Sign the Electron App

In the root of the project create a folder called cert and add the exported certificate.

```powershell
cert\MySelfSignedCert.pfx
```

Also add a file called `build-win.bat`

Add the following to the file.

```shell
set CSC_KEY_PASSWORD=mssql-inspect
set CSC_LINK=cert/VennersysElectronSelfSignedCert.pfx
npx electron-builder --win
```

Open cmd or powershell as an admin at the root of the project and run the following.

```powershell
.\cert\build-win.bat
```

#### Install the Self-Signed Certificate

Since the certificate is not from a trusted authority, users (or you) need to manually trust it before running the signed app.

- Open Certificate Manager (certmgr.msc).
- Go to Personal > Certificates.
- Right-click your self-signed certificate and select Copy.
- Navigate to Trusted Root Certification Authorities > Certificates.
- Right-click > Paste.
- Confirm the prompt to trust the certificate.
