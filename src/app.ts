import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import serverless from 'serverless-http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from './middlewares/error';
import authRoutes from './routes/auth'
import googleRoutes from './routes/googleAuth'
import { createMeetLink } from './helpers/GoogleMeet';

config({
    path: './.env'
});

// createMeetLink("Hello")

const app = express();


app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(
    cors({
      origin: [process.env.FRONTEND_URL!, 'https://mentor.leadlly.in', "http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    }),
  );

//routes
app.use('/api/auth', authRoutes)
app.use("/api/google", googleRoutes);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});


app.use(errorMiddleware);

// Wrapping express app with serverless-http
const handler = serverless(app);

export { app, handler };
