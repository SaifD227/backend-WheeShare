import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
import cors from 'cors';

dotenv.config();
const app = express();

// Apply CORS middleware before any routes
app.use(cors({ 
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;
