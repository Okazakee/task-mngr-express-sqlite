import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';

require('dotenv').config({ path: '../.env.local' });

const app = express();

const localhost = process.env.LOCAL_HOST_URL;
const exposed = process.env.EXPOSED_HOST_URL;

// cors only for frontend
app.use(cors({
  origin: [localhost!, exposed!],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));