import { Router } from 'express'
import {
	getLessons,
	createLesson,
	markLessonSent,
} from '../controllers/lessons.controller'

const router = Router()

router.get('/', getLessons)
router.post('/', createLesson)
router.post('/sent', markLessonSent)

export default router
