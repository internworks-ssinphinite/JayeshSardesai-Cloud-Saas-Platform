const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// make pool available via app.locals
app.locals.db = pool;

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`SS Infinite backend listening on port ${port}`);
});
