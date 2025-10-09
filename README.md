# SS Infinite - Full-Stack SaaS Platform Starter

SS Infinite is a modern, full-stack starter kit designed for building robust Software as a Service (SaaS) applications. It features a secure backend built with Node.js, Express, and PostgreSQL, and a responsive frontend powered by React, Vite, and Tailwind CSS.

This project provides a solid foundation with essential features like user authentication, email verification, and a protected dashboard, allowing you to focus on building your core application logic.

## ✨ Features

- **Secure JWT Authentication**: Stateless authentication using JSON Web Tokens.
- **Email Verification Flow**: New users are stored in a `pending_users` table and are only moved to the main `users` table after verifying their email address.
- **Secure Password Reset**: A complete password reset flow using a one-time password (OTP) sent to the user's email.
- **Protected Routes**: The frontend dashboard is protected, redirecting unauthenticated users to the login page.
- **Component-Based UI**: A clean and modern UI with sample dashboard pages for Services, Billing, Notifications, and Settings.
- **RESTful API**: A well-structured backend API with separated routes for authentication and other functionalities.

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (`jsonwebtoken`), `bcrypt` for password hashing
- **Emailing**: Nodemailer with Gmail for sending verification and password reset emails.

### Frontend

- **Library**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API Communication**: Axios
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or higher recommended)
- `npm` or `yarn`
- PostgreSQL server running locally or accessible.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JayeshSardesai/Saas-Platform.git
    cd Saas-Platform
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file from the example
    # Set up your PostgreSQL database and update the DATABASE_URL in the .env file.
    # Also, fill in your JWT_SECRET and email credentials.

    # Start the backend server (runs on http://localhost:4000 by default)
    npm run dev
    ```
    The server will automatically create the required tables in your database on its first run.

3.  **Setup the Frontend:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Start the frontend development server (runs on http://localhost:5173 by default)
    npm run dev
    ```
    The frontend is configured to proxy API requests from `/api` to the backend at `http://localhost:4000`.

4.  **You're all set!** Open your browser to `http://localhost:5173` to see the application.

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

| Variable                  | Description                                                                                               | Example                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `PORT`                    | The port for the backend server to run on.                                                                | `4000`                                                    |
| `DATABASE_URL`            | The connection string for your PostgreSQL database.                                                       | `postgres://user:password@localhost:5432/ss_infinite_db`  |
| `JWT_SECRET`              | A long, random, and secret string used to sign JWTs.                                                      | `your-super-secret-jwt-key`                               |
| `EMAIL_USER`              | Your Gmail address for sending emails.                                                                    | `youremail@gmail.com`                                     |
| `EMAIL_PASS`              | Your Gmail App Password (not your regular password).                                                      | `abcd efgh ijkl mnop`                                     |

## 📁 Project Structure

You've found one of the most common frustrations with Markdown! I understand completely. When you paste text with special characters like │ and ├──, GitHub doesn't know it's a diagram and tries to format it like regular text, which messes everything up.

The solution is to wrap the entire project structure inside a code block. This tells GitHub, "Display this text exactly as I've typed it, without changing any formatting."

Here is the corrected README.md content. Just copy and paste this entire block, and the project structure will finally look perfect on GitHub.

Markdown

# SS Infinite - Full-Stack SaaS Platform Starter

SS Infinite is a modern, full-stack starter kit designed for building robust Software as a Service (SaaS) applications. It features a secure backend built with Node.js, Express, and PostgreSQL, and a responsive frontend powered by React, Vite, and Tailwind CSS.

This project provides a solid foundation with essential features like user authentication, email verification, and a protected dashboard, allowing you to focus on building your core application logic.

## ✨ Features

- **Secure JWT Authentication**: Stateless authentication using JSON Web Tokens.
- **Email Verification Flow**: New users are stored in a `pending_users` table and are only moved to the main `users` table after verifying their email address.
- **Secure Password Reset**: A complete password reset flow using a one-time password (OTP) sent to the user's email.
- **Protected Routes**: The frontend dashboard is protected, redirecting unauthenticated users to the login page.
- **Component-Based UI**: A clean and modern UI with sample dashboard pages for Services, Billing, Notifications, and Settings.
- **RESTful API**: A well-structured backend API with separated routes for authentication and other functionalities.

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (`jsonwebtoken`), `bcrypt` for password hashing
- **Emailing**: Nodemailer with Gmail for sending verification and password reset emails.

### Frontend

- **Library**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API Communication**: Axios
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or higher recommended)
- `npm` or `yarn`
- PostgreSQL server running locally or accessible.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Saas-Platform-a1d3cc3790ede123e65265e723dbe3bb0402f201
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file from the example
    # On Mac/Linux:
    cp .env.example .env
    # On Windows:
    copy .env.example .env

    # Set up your PostgreSQL database and update the DATABASE_URL in the .env file.
    # Also, fill in your JWT_SECRET and email credentials.

    # Start the backend server (runs on http://localhost:4000 by default)
    npm run dev
    ```
    The server will automatically create the required tables in your database on its first run.

3.  **Setup the Frontend:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Start the frontend development server (runs on http://localhost:5173 by default)
    npm run dev
    ```
    The frontend is configured to proxy API requests from `/api` to the backend at `http://localhost:4000`.

4.  **You're all set!** Open your browser to `http://localhost:5173` to see the application.

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

| Variable                  | Description                                                                                               | Example                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `PORT`                    | The port for the backend server to run on.                                                                | `4000`                                                    |
| `DATABASE_URL`            | The connection string for your PostgreSQL database.                                                       | `postgres://user:password@localhost:5432/ss_infinite_db`  |
| `JWT_SECRET`              | A long, random, and secret string used to sign JWTs.                                                      | `your-super-secret-jwt-key`                               |
| `EMAIL_USER`              | Your Gmail address for sending emails.                                                                    | `youremail@gmail.com`                                     |
| `EMAIL_PASS`              | Your Gmail App Password (not your regular password).                                                      | `abcd efgh ijkl mnop`                                     |

## 📁 Project Structure
.
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json