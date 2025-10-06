# Shangri-La Petition Platform 🏛️

<div align="center">

![Project Banner](https://github.com/AishwaryaGitay/shangri-la-petition-platform/blob/main/docs/Screenshots/HomePage.png) <!-- if you have -->

**A comprehensive digital petition management system enabling citizens to create, sign, and track petitions**

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

---

## 📝 About

 The Shangri-La Petition Platform (SLPP) is a full-stack application built with a Spring Boot backend and a ReactJS frontend. 

The platform enables citizens to:
- ✍️ Create petitions on matters of public interest
- ✅ Sign existing petitions digitally
- 📊 Track petition progress and signature counts
- 🏛️ Receive responses from the Petitions Committee

Once a petition meets the signature threshold, it qualifies for parliamentary debate and receives an official response.

---

## ✨ Features

### For Citizens (Petitioners)
- 🔐 **Secure Registration** with biometric ID verification
- 📝 **Create Petitions** with title, description, and category
- ✍️ **Digital Signatures** with one-signature-per-citizen validation
- 📱 **QR Code Login** for quick authentication
- 📊 **Real-time Status** tracking (Open/Closed/Under Review)
- 🔔 **Responsive Design** - works on all devices

### For Administrators
- 🎛️ **Admin Dashboard** for petition management
- ⚖️ **Threshold Management** - set signature requirements
- 💬 **Respond to Petitions** with official statements
- 🔒 **Role-based Access Control** with Spring Security

---

## 🛠️ Tech Stack

### Backend
- **Java 21** - Core programming language
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **Hibernate** - ORM framework
- **MySQL 8.0** - Relational database
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Lombok** - Boilerplate code reduction
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Development Tools
- **Eclipse IDE** - Backend development
- **VS Code** - Frontend development
- **Postman** - API testing
- **MySQL Workbench** - Database management
- **Git** - Version control

---
### Key Components

#### Backend Architecture
- **Controllers**: Handle HTTP requests and responses
  - `AdminController` - Admin operations
  - `PetitionController` - Petition CRUD operations
  - `PetitionerController` - User management
  - `LoginController` - Authentication

- **Services**: Business logic layer
  - `PetitionService` - Petition management logic
  - `SignatureService` - Signature validation
  - `JWTService` - Token generation/validation

- **Models**: JPA entities
  - `Petition` - Petition data
  - `Petitioner` - User data
  - `Signature` - Signature records
  - `BioId` - Biometric verification

---


## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- Java 21 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.8+

---

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/shangri-la-petition-platform.git
cd shangri-la-petition-platform
```
2️⃣ Database Setup

#### Login to MySQL
```bash
mysql -u root -p
```

#### Create database
```bash
CREATE DATABASE slpp;
```

#### (Optional) Import sample data
```bash
mysql -u root -p slpp < backend/database/ang6.sql
```
3️⃣ Backend Setup
#### Navigate to backend directory
```bash
cd backend/slpp
```

#### Configure database credentials in src/main/resources/application.properties
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/slpp
spring.datasource.username=root
spring.datasource.password=your_password
```

#### Build and run the application
```bash
mvn clean install
mvn spring-boot:run
```
Backend will start at: http://localhost:8082

4️⃣ Frontend Setup
#### Navigate to frontend directory
```bash
cd frontend/slpp_frontend
```

#### Install dependencies
```bash
npm install --force
```

#### Start development server
```bash
npm run dev
```
Frontend will start at: http://localhost:5173

5️⃣ Initialize Data
Execute the following SQL queries to set up initial data:
```bash
sql-- Insert sample BioIDs
INSERT INTO bio_id (code, used) VALUES 
('K1YL8VA2HG', 0), 
('V30EPKZQI2', 0),
('QJXQOUPTH9', 0),
('CET8NUAE09', 0),
('BZW5WWDMUY', 0);
-- Add remaining BioID codes as needed
```

 Create admin user (generate bcrypt hash for password at https://bcrypt-generator.com/)
```bash
INSERT INTO users (id, bioid, dob, email, fullname, password, role) 
VALUES (2, NULL, NULL, 'admin@petition.parliament.sr', 'Admin User', 
'$2a$12$hashedpassword', 'ADMIN');
```
Note: Generate a BCrypt hash for your admin password using an online BCrypt generator and replace $2a$12$hashedpassword with your generated hash.

## ✅ Verify Installation
Once both servers are running:

- Open your browser and navigate to http://localhost:5173
- You should see the Shangri-La Petition Platform homepage
- Test the login with admin credentials
- Backend API is accessible at http://localhost:8082


## 📸 Screenshots

### Petitioner SignUp
![Petitioner SignUp](https://github.com/AishwaryaGitay/shangri-la-petition-platform/blob/main/docs/Screenshots/Screenshot%202025-01-13%20023614.png)

### All Petitions
![All Petitions](https://github.com/AishwaryaGitay/shangri-la-petition-platform/blob/main/docs/Screenshots/Screenshot%202025-01-13%20025112.png)

### Petitioner's Petition
![My Petition](https://github.com/AishwaryaGitay/shangri-la-petition-platform/blob/main/docs/Screenshots/Screenshot%202025-01-13%20025140.png)

### Admin Dashboard
![Admin Dashboard](https://github.com/AishwaryaGitay/shangri-la-petition-platform/blob/main/docs/Screenshots/Screenshot%202025-01-13%20025227.png)

### QR Code
![QR Code](https://github.com/AishwaryaGitay/shangri-la-petition-platform/blob/main/docs/Screenshots/Screenshot%202025-01-13%20023954.png)


## 🤝 Contributing
This is an academic project, but feedback and suggestions are welcome!

- Fork the repository
- Create a feature branch (git checkout -b feature/YourFeature)
- Commit your changes (git commit -m 'Add some feature')
- Push to the branch (git push origin feature/YourFeature)
- Open a Pull Request

