import { app } from "./app";
import ConnectToDB from "./db/db";
import { watchMentorCollection } from "./events/verifiedMentor";
import { otpWorker } from "./services/bullmq/worker";
import { logger } from "./utils/winstonLogger";

const port = process.env.PORT || 4001


//Database
ConnectToDB()

//event for mentor collection
watchMentorCollection()

otpWorker
app.listen(port, () => logger.info(`Server is running on port ${port}`));
