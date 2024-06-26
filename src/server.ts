import { app } from "./app";
import ConnectToDB, { questions_db } from "./db/db";
import { otpWorker } from "./services/bullmq/worker";
import { connectToRedis } from "./services/redis";

const port = process.env.PORT || 4001


//Database
ConnectToDB()

// Redis
// connectToRedis()
questions_db.on("connected", () => {
  console.log("Question_DB connected");
});

otpWorker
app.listen(port, () => console.log(`Server is working on port ${port}`))