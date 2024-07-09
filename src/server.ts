import { app } from "./app";
import ConnectToDB, { questions_db } from "./db/db";
import { watchMentorCollection } from "./events/verifiedMentor";
import { otpWorker } from "./services/bullmq/worker";
import { oauth2Client } from "./services/Google/getOauth";

const port = process.env.PORT || 4001


//Database
ConnectToDB()

// Redis
// connectToRedis()
questions_db.on("connected", () => {
  console.log("Question_DB connected");
});

//event for mentor collection
watchMentorCollection()

otpWorker
app.listen(port, () => console.log(`Server is working on port ${port}`))