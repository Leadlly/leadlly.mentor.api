import { Worker } from 'bullmq'
import Redis from "ioredis";

const connection = new Redis({ maxRetriesPerRequest: null });
export const myWorker = new Worker('myqueue', async (job) => {
    // await sendMail(job, next)
}, { connection });