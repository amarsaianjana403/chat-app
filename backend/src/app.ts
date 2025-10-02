import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

export const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());


app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/', (req, res)=> res.send({message: 'Hello API'}));