import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from './middlewares/error';
import authRoutes from './routes/auth'
import googleRoutes from './routes/googleAuth'
import userRoutes from './routes/user'
import meetingRoutes from './routes/meeting'
import studentRoutes from './routes/student'
import expressWinston from 'express-winston'
import winston from 'winston'


config({
    path: './.env'
});

// createMeetLink("Hello")

const app = express();


app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.cli(),
    ),
    meta: true,
    expressFormat: true,
    colorize: true,
  }),
);

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
app.use("/api/user", userRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/student", studentRoutes)

app.get('/api', (req, res) => {
    res.send('Hello, world!');
});


app.use(errorMiddleware);

export { app };
