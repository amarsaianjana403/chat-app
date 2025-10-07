import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import friendRoutes from './routes/friendRoutes';

export const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());


app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/friend', friendRoutes);
app.use('/', (req, res)=> res.send({message: 'Hello API'}));