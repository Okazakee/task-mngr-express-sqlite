import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import {rateLimit} from 'express-rate-limit';

// global rate limit
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 10 requests per windowMs
});

require('dotenv').config({ path: '../.env.local' });

const app = express();

const localhost = process.env.LOCAL_HOST_URL;
const exposed = process.env.EXPOSED_HOST_URL;

app.use(limiter);

// cors only for frontend
app.use(cors({
  origin: [localhost!, exposed!],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/v1', taskRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));