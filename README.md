
# Temple Management Backend

## Overview

This backend is built with Node.js and Express to support the temple website management system. It provides REST APIs for managing donations, donors, expenses, events, reports, and user authentication including password management.

---

## Features

### User Authentication & Profile
- Login with username + password or mobile number.
- Mobile login supports password reset flow.
- Password reset requires users to set a new password before continuing.
- User profile management for viewing and updating password.

### CRUD Operations for Temple Data
- Donations, Donors, Expenses (with image upload), Events, and Reports.
- Each entity supports Create, Read, Update, Delete operations.
- Expenses support image uploads using Multer.

### Derived Reports
- Aggregate donor reports with filtering by event.

---

## API Routes

| Route                     | Method | Description                                               |
|---------------------------|--------|-----------------------------------------------------------|
| `/api/login`              | POST   | Login with username/password or mobile number (with reset option) |
| `/api/users`              | GET    | Get all users                                             |
| `/api/users`              | POST   | Create a new user                                         |
| `/api/users/:id`          | PUT    | Update user info (e.g. password)                          |
| `/api/donations`          | CRUD   | Manage donations                                          |
| `/api/donors`             | CRUD   | Manage donors                                             |
| `/api/expenses`           | CRUD   | Manage expenses (with image upload support)              |
| `/api/events`             | CRUD   | Manage events                                            |
| `/api/reports`            | CRUD   | Manage reports                                           |
| `/api/derived-donors`     | GET    | Aggregate donor report, filterable by event               |

---

## Password Reset Flow

1. User attempts login via mobile number.
2. Backend verifies the mobile number.
3. Backend responds requiring password reset.
4. User sets new password via profile/password reset form (`PUT /api/users/:id`).
5. User logs in again using the new password.

---

## Backend Setup Instructions

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
````

3. Start the server:

   ```bash
   node backend/server.js
   ```

4. Server runs at: [http://localhost:5000](http://localhost:5000)

---

## Frontend Integration Notes

* Ensure login and password reset requests include proper JSON headers:

  ```javascript
  headers: { "Content-Type": "application/json" }
  ```

* Password update API requires user ID in URL and JSON body with new password:

  ```json
  {
    "password": "newPassword123"
  }
  ```

* After password reset, clear any saved login sessions/localStorage and redirect to login page.

---

## Important Notes

* User passwords are stored in plaintext in `users.json` for simplicity. For production, implement proper password hashing.
* The server uses local JSON files (`data/*.json`) for storage.
* Multer is used for image uploads on the expenses API.
* Static files served from `/public` and `/admin` folders.

---

## Contact

For issues, feature requests or contributions, please contact:

Hemant Pramod Mahajan
Email: hpmahajan2013@gmail.com

---

*Last updated: May 2025*

