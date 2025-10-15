### README for `internworks-ssinphinite/jayeshsardesai-cloud-saas-platform`

# SS Infinite - Cloud SaaS Platform

This repository contains the codebase for the SS Infinite Cloud SaaS Platform, a fork of the [original SS Infinite project](https://github.com/JayeshSardesai/Saas-Platform). It is a full-stack application designed for building robust Software as a Service (SaaS) applications, featuring a Node.js backend, a React frontend, and a Python microservice for AI-powered document analysis.

This project provides a solid foundation with essential features like user authentication, subscription billing, and a protected dashboard, allowing you to focus on building your core application logic.

## ✨ Features

* **Secure JWT Authentication**: Stateless authentication using JSON Web Tokens.
* **Email Verification & Password Reset**: Secure flows for user account management using Nodemailer.
* **Subscription-Based Billing**: Integration with Razorpay for handling monthly and yearly plans with prorated upgrades and downgrades.
* **AI Document Analyzer**: A microservice that provides text summarization and image analysis for uploaded documents (PDF, DOCX, JPG, PNG).
* **Usage Tracking & Notifications**: Users have an analytics dashboard to track their credit usage and a notification center for important account updates.
* **RESTful API & Microservice Architecture**: A well-structured backend API that communicates with a separate Python service for AI tasks.

## 🛠️ Tech Stack

| Area | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js, PostgreSQL, JWT, bcrypt, Razorpay |
| **Frontend**| React.js, Vite, Tailwind CSS, React Router, Axios, Chart.js |
| **AI Service** | Python, Flask, Hugging Face Transformers (`t5-small`, `Salesforce/blip-image-captioning-large`), Docker |

The AI service is containerized with Docker and deployed as a [Hugging Face Space](https://huggingface.co/spaces) for inference.

## 🚀 Getting Started

### Prerequisites

* Node.js (v18.0 or higher)
* `npm` or `yarn`
* Python (v3.9 or higher) with `pip`
* PostgreSQL server
* Docker (optional, for running the AI service locally in a container)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/internworks-ssinphinite/jayeshsardesai-cloud-saas-platform.git
    cd jayeshsardesai-cloud-saas-platform
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file and add the environment variables listed below

    # Start the backend server (runs on http://localhost:4000)
    npm run dev
    ```

3.  **Setup the Frontend:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Start the frontend development server (runs on http://localhost:5173)
    npm run dev
    ```

4.  **Setup the AI Service:**
    ```bash
    # Open another terminal and navigate to the services directory
    cd services

    # Install Python dependencies
    pip install -r requirements.txt

    # Run the service (runs on http://localhost:7860 by default)
    python main.py
    ```

5.  **You're all set!** Open your browser to `http://localhost:5173` to see the application. The frontend proxies API requests to the backend, which in turn communicates with the AI service.

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory and add the following variables.

```env
# Server Configuration
PORT=4000

# Database Configuration
DATABASE_URL=postgres://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME

# JWT Secret (generate a long, random string)
JWT_SECRET=your-super-secret-jwt-key-that-is-long-and-random

# Email Configuration (use your own Gmail and App Password)
# See https://support.google.com/accounts/answer/185833 for App Passwords
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Gemini API Key (optional, if you plan to add Gemini features)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Summarizer API Endpoint
# Option 1: For local development, use the local service URL
ANALYSIS_API_URL="http://127.0.0.1:7860"
# Option 2: For production, use your deployed Hugging Face Space URL
# ANALYSIS_API_URL="https://your-username-your-space-name.hf.space"

# Razorpay Credentials (get these from your Razorpay dashboard)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

## 📁 Project Structure
```bash
.
├── backend/
│   ├── src/            # API logic (routes, middleware, utils)
│   └── server.js       # Main server entry point
├── frontend/
│   ├── src/            # React components and pages
│   └── vite.config.js  # Vite configuration with proxy
└── services/
    ├── summarizer/
    │   └── app.py      # Flask application for AI models
    ├── Dockerfile      # Docker configuration for the service
    └── main.py         # Main script to run the service
```