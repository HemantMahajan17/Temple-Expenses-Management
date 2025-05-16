


# Temple Website Management System - Expenses Module

This project is part of a **Temple Management System** that allows temple administrators to manage expenses, donations, events, and more. This module focuses on **Expense Management** with the ability to add, edit, delete expenses, upload receipt images, and view them in a list.

---

## Features

- Add new expenses with:
  - Title
  - Amount (₹)
  - Date
  - Notes (optional)
  - Receipt Image (optional upload)
- View all expenses in a table including receipt image thumbnails.
- Edit existing expenses.
- Delete expenses.
- User login system to restrict admin pages.
- Responsive UI built with Tailwind CSS.
- Data persistence with backend API (Node.js + Express).
- Image upload and serving via backend.

---

## Folder Structure

```

/admin/                   # Admin panel for temple members (after login)
├── dashboard.html      # Admin dashboard page
├── expenses.html       # Expense management page
├── donations.html      # Donations management (future)
/assets/
├── css/                # Stylesheets
├── images/             # Static images
/public/                  # Public-facing website pages
├── index.html          # Homepage
├── about.html          # About temple page
├── contact.html        # Contact page
├── events.html         # Events info page
├── gaushala.html       # Gaushala page
├── upcoming.html       # Upcoming events page
/backend/                 # Backend Node.js API server
├── server.js           # Main server code
├── package.json
├── /uploads            # Uploaded images storage (created dynamically)

````

---

## Backend Setup

The backend is built using **Node.js** and **Express**. It provides RESTful APIs for expenses management, including image upload support.

### Prerequisites

- Node.js v14+ installed
- npm installed

### Installation and Running

1. Navigate to the backend folder:

   ```bash
   cd backend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

4. The backend server will start on `http://localhost:5000/`

---

## Frontend Setup

The frontend consists of HTML, CSS, and JavaScript files served as static files.

### Serving frontend files

You can open the HTML files directly in your browser or serve them using a local HTTP server (recommended).

To serve from a local server (optional):

```bash
# From the project root or public folder, you can run:
npx serve public
```

Or use VS Code Live Server extension.

---

## Authentication (Login)

* The admin panel pages (`/admin/*`) require login.
* Login status is managed via `localStorage` key `isLoggedIn`.
* Login page is at `/admin/login.html`.
* After successful login, `localStorage.setItem('isLoggedIn', 'true')` is set.
* On logout, the key is removed and user is redirected to login page.

---

## API Endpoints

| Method | Endpoint            | Description                             |
| ------ | ------------------- | --------------------------------------- |
| GET    | `/api/expenses`     | Fetch all expenses                      |
| POST   | `/api/expenses`     | Add new expense (supports image upload) |
| PUT    | `/api/expenses/:id` | Update expense by ID                    |
| DELETE | `/api/expenses/:id` | Delete expense by ID                    |

---

## Usage

* Login to admin panel.
* Go to `expenses.html`.
* Add new expenses via form.
* View expenses list below the form.
* Edit or delete existing expenses via action buttons.
* Uploaded images show as thumbnails in the expenses list.
* Logout from the dashboard.

---

## Technologies Used

* **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
* **Backend**: Node.js, Express, multer (for file uploads)
* **Storage**: In-memory or file-based image storage in `/backend/uploads`
* **Others**: LocalStorage for session check on frontend

---

## Future Enhancements

* Add persistent database (MongoDB, MySQL).
* Implement role-based authentication.
* Add reports and export options.
* Improve UI/UX for mobile responsiveness.
* Add other modules (Donations, Events, Donors).
* Deploy to cloud or hosting platform.

---

## How to Contribute

* Fork the repo
* Create a new branch
* Add your feature or bugfix
* Submit a pull request

---

## License

MIT License © Hemant Pramod Mahajan

---

## Contact

Email: [hpmahajan2013@gmail.com](mailto:hpmahajan2013@gmail.com)


---

Thank you for using the Temple Management System!

---