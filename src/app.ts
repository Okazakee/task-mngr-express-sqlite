import express from 'express';
import taskRoutes from './routes/taskRoutes';

const app = express();
app.use(express.json());

app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));