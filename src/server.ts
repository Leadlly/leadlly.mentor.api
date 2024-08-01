import { app } from "./app";
import ConnectToDB from "./db/db";
import { watchMentorCollection } from "./events/verifiedMentor";
import { otpWorker } from "./services/bullmq/worker";
import { logger } from "./utils/winstonLogger";
import serverless from 'serverless-http';


const port = process.env.PORT || 4001


//Database
ConnectToDB()

//event for mentor collection
watchMentorCollection()

otpWorker


const handler = serverless(app);
app.listen(port, () => logger.info(`Server is running on port ${port}`));

export { handler };