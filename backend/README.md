# Portfolio CMS Backend API

Backend API untuk sistem portfolio developer dengan CMS.

## 🚀 Features

- ✅ RESTful API untuk CRUD project
- ✅ JWT Authentication untuk admin
- ✅ Image upload support
- ✅ MySQL database dengan Sequelize ORM
- ✅ Auto-create default admin user

## 📋 Prerequisites

- Node.js >= 16.x
- MySQL Server >= 5.7

## 🛠 Installation

1. Install dependencies:
```bash
npm install
```

2. Setup database:
   - Buat database MySQL baru: `portfolio_db`
   - Atau update konfigurasi di file `.env`

3. Configure environment variables:
   - Copy `.env.example` ke `.env`
   - Update konfigurasi database di `.env`

4. Run development server:
```bash
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Projects
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get project by ID (public)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## 🔐 Default Admin Credentials

Setelah pertama kali menjalankan server, admin default akan dibuat:
- **Username:** admin
- **Password:** admin123

*(Jangan lupa ganti di production!)*

## 📝 Example Usage

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Projects
```bash
curl http://localhost:5000/api/projects
```

### Create Project (with image)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Project" \
  -F "description=Project description" \
  -F "techStack=React,Node.js,MySQL" \
  -F "demoUrl=https://demo.com" \
  -F "image=@/path/to/image.jpg"
```

## 🗄️ Database Schema

### Admins Table
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- email (VARCHAR)
- createdAt (DATETIME)

### Projects Table
- id (INT, PK, AUTO_INCREMENT)
- title (VARCHAR)
- description (TEXT)
- techStack (VARCHAR)
- demoUrl (VARCHAR)
- githubUrl (VARCHAR)
- imageUrl (VARCHAR)
- featured (BOOLEAN)
- published (BOOLEAN)
- createdAt (DATETIME)
- updatedAt (DATETIME)

## 📁 Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Auth & upload middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── uploads/         # Uploaded images
├── .env             # Environment variables
├── .env.example     # Environment template
├── server.js        # Main server file
└── package.json
```

## 🔒 Security Notes

- Ganti `JWT_SECRET` di production
- Gunakan HTTPS di production
- Batasi ukuran upload file
- Implementasi rate limiting untuk production

## 📄 License

ISC
