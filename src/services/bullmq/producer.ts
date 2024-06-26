import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis()

// Reuse the ioredis instance
export const myQueue = new Queue('myqueue', { connection });


