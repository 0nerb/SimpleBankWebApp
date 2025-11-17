# SimpleBankWebApp

A full-stack web application for a simple banking system with a React frontend and Node.js/Express backend.

## 📋 Project Overview

SimpleBankWebApp is a web-based banking application that allows users to authenticate with their account credentials and access banking services. The application features a modern React interface with form validation and a robust Express server backend connected to a MySQL database.

## 🏗️ Architecture

The project follows a client-server architecture with two main components:

- **Frontend**: React-based single-page application (SPA)
- **Backend**: Node.js/Express REST API server with MySQL database

## 📁 Project Structure

```
SimpleBankWebApp/
├── front-end/              # React frontend application
│   ├── public/
│   │   └── index.html      # HTML entry point
│   ├── src/
│   │   ├── index.js        # React entry point
│   │   └── Components/
│   │       └── Login/
│   │           ├── Login.js
│   │           └── style.css
│   ├── package.json
│   └── README.md
├── server/                 # Express backend server
│   ├── index.js           # Server entry point
│   └── package.json
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database (or use the configured Aiven cloud database)

### Installation

#### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The server will run with `nodemon` for automatic restarts on file changes.

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open in your browser at `http://localhost:3000`.

## 🔧 Technology Stack

### Frontend
- **React** (v18.3.1) - UI library
- **Formik** - Form state management and validation
- **Yup** - Schema validation
- **Axios** - HTTP client for API requests
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

### Backend
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Cors** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload
- **Axios** - HTTP client (for external requests)

## 🔑 Features

- **User Authentication**: Login with account number and password
- **Form Validation**: Client-side validation with Formik and Yup
- **Database Integration**: MySQL database for storing account information
- **CORS Support**: Secure cross-origin requests between frontend and backend
- **Error Handling**: Comprehensive error handling with toast notifications
- **Responsive Design**: Modern and responsive user interface

## 📡 API Endpoints

### POST /login
Authenticates a user with their account number and password.

**Request Body:**
```json
{
  "contaCorrente": "account_number",
  "senha": "password"
}
```

**Response:**
Returns user account information if credentials are valid.

## 🛠️ Available Scripts

### Frontend
```bash
npm start      # Start development server
npm build      # Create production build
npm test       # Run tests
npm eject      # Eject from Create React App (irreversible)
```

### Backend
```bash
npm start      # Start server with nodemon
```

## 📝 Notes

- Database credentials are configured in `server/index.js`
- The application uses Aiven cloud-hosted MySQL for the database
- CORS is enabled to allow frontend-backend communication

## 📄 License

ISC

## 👤 Author

Breno Kern Rangel

---

**Ready to get started?** Clone the repository, follow the installation steps, and run both the backend and frontend servers to see the application in action!
