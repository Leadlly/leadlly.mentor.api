import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { sendNotification } from '../controllers/Notifications';

const router = express.Router();

router.post('/send', checkAuth, sendNotification);

export default router;
