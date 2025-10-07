SS Infinite - Frontend

Setup
1. Install dependencies: `npm install` (you may need to install create-react-app tooling if starting from scratch).
2. Run the dev server: `npm start`.

Proxying API requests
When running the frontend locally during development, you can set a proxy in `package.json` or use a full URL when calling the backend. The frontend code assumes the backend is reachable at the same origin under `/api` (e.g., via a proxy).
