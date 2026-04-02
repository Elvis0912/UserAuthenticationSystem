# AuthSystem - Full Stack Authentication System

A robust and secure Full Stack User Authentication System built with **.NET Core Web API** and **React.js**. This project features a modern split-screen design, JWT authentication, and MySQL database integration.

## 🚀 Features

- **User Registration**: Secure sign-up with password hashing and duplicate email checks.
- **User Login**: JWT-based authentication with "Remember Me" functionality.
- **Protected Profiles**: Secure Dashboard access requiring valid JWT tokens.
- **UI/UX**: Premium design using **Inter** font, **Glassmorphism**, and split-screen layouts.
- **Bonus Feature 1**: Password show/hide toggle for improved accessibility.
- **Bonus Feature 2**: "Remember Me" sync (persistence across browser restarts).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Modern Design System)
- **HTTP Client**: Axios (with Request/Response Interceptors)
- **Routing**: React Router DOM

### Backend
- **Framework**: .NET 8.0 Core Web API
- **Security**: JWT Authentication, Custom Password Hasing
- **Database Provider**: Pomelo.EntityFrameworkCore.MySql

### Database
- **Engine**: MySQL 8.0
- **Table Structure**: `Users` table with unique Email constraints.

---

## 🏗️ Setup Instructions

### 1. Database Setup
Follow these steps to set up the MySQL database:

#### Step A: Create Database & Table
Run the following from [database/Db_Table.sql]
```sql
CREATE DATABASE authdb;
USE authdb;

CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    PasswordHash VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Step B: Create Stored Procedure
Run the following from [database/Stored_Procedure.sql]
```sql
DELIMITER $$

CREATE PROCEDURE sp_AuthUser (
    IN p_Action VARCHAR(20),
    IN p_Name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_PasswordHash VARCHAR(255)
)
BEGIN

    -- 1. REGISTER
    IF p_Action = 'REGISTER' THEN
        IF EXISTS (SELECT 1 FROM Users WHERE Email = p_Email) THEN
            SELECT 409 AS StatusCode, 'Email already exists' AS Message;
        ELSE
            INSERT INTO Users (Name, Email, PasswordHash)
            VALUES (p_Name, p_Email, p_PasswordHash);
            SELECT 200 AS StatusCode, 'User registered successfully' AS Message;
        END IF;

    -- 2. LOGIN
    ELSEIF p_Action = 'LOGIN' THEN
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = p_Email) THEN
            SELECT 404 AS StatusCode, 'User not found' AS Message;
        ELSE
            SELECT 200 AS StatusCode, 'Login Successful' AS Message,
                   Id, Name, Email, PasswordHash
            FROM Users WHERE Email = p_Email;
        END IF;

    -- 3. PROFILE
    ELSEIF p_Action = 'PROFILE' THEN
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = p_Email) THEN
            SELECT 404 AS StatusCode, 'User not found' AS Message;
        ELSE
            SELECT 200 AS StatusCode, 'Profile data fetched' AS Message,
                   Id, Name, Email, NULL AS PasswordHash
            FROM Users WHERE Email = p_Email;
        END IF;
    END IF;

END $$

DELIMITER ;
```

### 2. Backend Configuration

#### Step A: Connection String Setup
1. Open `AuthSystem/backend/AuthSystem.API/appsettings.json`.
2. Locate the `ConnectionStrings` section and update it with your local MySQL credentials:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "server=localhost;database=authdb;user=YOUR_USERNAME;password=YOUR_PASSWORD"
   }
   ```

#### Step B: Run the API
1. In the terminal:
   ```bash
   cd AuthSystem/backend/AuthSystem.API
   dotnet restore
   dotnet run
   ```
   *The API will be available at http://localhost:5000*

### 3. Frontend Configuration
1. In a new terminal:
   ```bash
   cd AuthSystem/frontend
   npm install
   npm run dev
   ```
   *The app will be available at http://localhost:5173*

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET` | `/api/user/profile` | Get logged-in user details | **Yes (JWT)** |

---

## 🛡️ Security Implementation

- **JWT Authentication**: Secured with a 32-character secret key.
- **Axios Interceptor**: Automatically attaches the Bearer Token to all protected requests.
- **Auto-Logout**: A response interceptor automatically purges invalid/expired sessions and redirects to Login.
- **SQL Protection**: Use of safe parameterized stored procedures to prevent SQL injection.

---

## 📸 Screenshots

Visual documentation of the project can be found in the [screenshots](file:///c:/Users/elvis/source/repos/UserAuthenticationApp/AuthSystem/screenshots) folder:

- **Frontend (React)**: Screenshots of the Login, Registration, and Dashboard pages are available in [screenshots/frontend(React)](file:///c:/Users/elvis/source/repos/UserAuthenticationApp/AuthSystem/screenshots/frontend(React)).
- **Backend (WebApi)**: API testing and Swagger documentation screenshots are available in [screenshots/backend(WebApi)](file:///c:/Users/elvis/source/repos/UserAuthenticationApp/AuthSystem/screenshots/backend(WebApi)).

---

## 🧪 Testing Scenarios
Verified flows in development:
1. **Successful Login**: Token received and stored in `localStorage`.
2. **Invalid Login**: Proper error messaging for wrong credentials.
3. **Duplicate Login**: Prevented via database `UNIQUE` constraint.
4. **401 Handling**: Redirect to login when token is missing or manually deleted.

---

*This project was completed as a 2-day technical assignment.*