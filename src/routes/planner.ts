import express from 'express'
import { createPlanner } from '../controllers/planner'
import { checkAuth } from '../middlewares/checkAuth'

const router = express.Router()

router.post('/create', checkAuth, createPlanner)

export default router