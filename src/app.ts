import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import serverless from 'serverless-http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from './middlewares/error';
import authRoutes from './routes/auth'
import googleRoutes from './routes/googleAuth'
import { io as socketIoClient } from 'socket.io-client';
import Redis from 'ioredis';

config({
    path: './.env'
});

const app = express();
const redis = new Redis();
const redisPublisher = new Redis();

const chatSocket = socketIoClient('http://localhost:8080');

chatSocket.on('connect', () => {
  console.log('Connected to chat server');
});

chatSocket.on('receiveMessage', (message: string) => {
  console.log('New message:', message);
});

app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cors())

//routes
app.use('/api/auth', authRoutes)
app.use("/api/google", googleRoutes);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/send-message', (req, res) => {
    const { message } = req.body;
    redisPublisher.publish('chat-messages', message);
    res.send({ status: 'Message sent' });
  });


app.use(errorMiddleware);

// Wrapping express app with serverless-http
const handler = serverless(app);

export { app, handler };
