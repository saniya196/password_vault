# 🔐 Password Vault - Secure Password Manager

A privacy-first password manager with client-side encryption, built with Next.js, MongoDB, and TypeScript.

**Live Demo:** [https://password-vault-eight.vercel.app](https://password-vault-eight.vercel.app)

---

## ✨ Features

### Core Features
- **🔑 Password Generator** - Generate strong, customizable passwords with length control and character options
- **🔒 Client-Side Encryption** - AES-256 encryption ensures passwords are encrypted before leaving your browser
- **💾 Secure Vault** - Store unlimited passwords, usernames, URLs, and notes
- **🔍 Search & Filter** - Quickly find credentials by title, username, or URL
- **📋 Copy with Auto-Clear** - Copy passwords to clipboard with automatic clearing after 15 seconds
- **✏️ Full CRUD Operations** - Add, view, edit, and delete vault items
- **👤 User Authentication** - Secure JWT-based authentication

### Security Features
- All sensitive data encrypted client-side before transmission
- Server never sees plaintext passwords
- Master password used for encryption key derivation
- PBKDF2 key derivation with 10,000 iterations
- Passwords excluded from server logs

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15.5.4 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks

**Backend:**
- Next.js API Routes
- MongoDB Atlas
- Mongoose ODM

**Security:**
- CryptoJS (AES-256 encryption)
- bcrypt (password hashing)
- JWT (authentication tokens)

---

## 🔐 Encryption Method

**Client-side AES-256 encryption using CryptoJS.** The user's master password derives an encryption key via PBKDF2 with 10,000 iterations. All vault data is encrypted in the browser before transmission—the server only stores encrypted blobs and never sees plaintext passwords.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/saniya196/password-vault.git
cd password-vault
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**MongoDB Setup:**
- Create a free MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string from "Connect" → "Connect your application"
- Add your IP to Network Access (or allow 0.0.0.0/0 for development)

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 📖 Usage

### First Time Setup

1. **Sign Up** - Create an account with email and password
2. **Set Master Password** - Use your login password as the master encryption key
3. **Generate Password** - Use the built-in generator to create strong passwords
4. **Save to Vault** - Store credentials with title, username, URL, and notes
5. **Search & Manage** - Find, edit, copy, or delete your passwords

### Password Generator Options

- Length: 8-32 characters
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special symbols (!@#$%)
- Exclude lookalike characters (0/O, 1/l/I)

---

## 🗂️ Project Structure

```
password-vault/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   └── vault/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── vault/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── PasswordGenerator.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   ├── auth.ts
│   │   ├── crypto.ts
│   │   └── AuthContext.tsx
│   └── models/
│       ├── User.ts
│       └── Vault.ts
├── .env.local
├── package.json
└── README.md
```

---

## 🔒 Security Considerations

### What's Secure
✅ Client-side encryption (server never sees plaintext)  
✅ PBKDF2 key derivation with high iteration count  
✅ Passwords hashed with bcrypt before storage  
✅ JWT tokens for authentication  
✅ HTTPS in production (via Vercel)  

### Important Notes
⚠️ Master password is NOT recoverable - if forgotten, vault data is lost  
⚠️ This is an MVP - not audited for production use  
⚠️ For production, consider additional features like 2FA, backup keys, etc.  

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- Click Deploy

3. **Update Environment Variable**
- After deployment, update `NEXT_PUBLIC_APP_URL` with your live URL
- Redeploy to apply changes

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user

### Vault
- `GET /api/vault` - Get all vault items (requires auth)
- `POST /api/vault` - Create new vault item (requires auth)
- `PUT /api/vault/[id]` - Update vault item (requires auth)
- `DELETE /api/vault/[id]` - Delete vault item (requires auth)

---

## 🎯 Future Enhancements

- [ ] Two-Factor Authentication (2FA/TOTP)
- [ ] Tags and folders for organization
- [ ] Export/Import encrypted vault (JSON)
- [ ] Password strength indicator
- [ ] Dark mode toggle
- [ ] Password history
- [ ] Secure password sharing
- [ ] Browser extension
- [ ] Mobile apps

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 👨‍💻 Author

Built as part of a technical assignment to demonstrate full-stack development skills with Next.js, MongoDB, and client-side encryption.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB Atlas for free database hosting
- Vercel for seamless deployment
- CryptoJS for encryption utilities

---

**⭐ If you found this project helpful, please consider giving it a star!**