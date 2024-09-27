import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { rateLimit } from 'express-rate-limit';
import { authenticateJWT } from './services/authMiddleware';

// global rate limit
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 10 requests per windowMs
});

require('dotenv').config({ path: '../.env.local' });
const cookieParser = require('cookie-parser');

const app = express();

const localhost = process.env.LOCAL_HOST_URL;
const exposed = process.env.EXPOSED_HOST_URL;
export const jwtSecret = process.env.JWT_SECRET;

app.use(limiter);

// cors only for frontend
app.use(cors({
  origin: [localhost!, exposed!],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(cookieParser());

app.use(express.json());

// Unprotected auth routes (registration, login, etc.)
app.use('/api/v1/auth', authRoutes);

// Protected routes for tasks and users
app.use('/api/v1/tasks', authenticateJWT, taskRoutes);
app.use('/api/v1/users', authenticateJWT, userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));