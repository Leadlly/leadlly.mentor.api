import { app } from "./app";
import ConnectToDB from "./db/db";
import { watchMentorCollection } from "./events/verifiedMentor";
import { otpWorker } from "./services/bullmq/worker";

const port = process.env.PORT || 4001


//Database
ConnectToDB()

//event for mentor collection
watchMentorCollection()

otpWorker
app.listen(port, () => console.log(`Server is working on port ${port}`))