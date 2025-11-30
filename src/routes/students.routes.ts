import { Router } from 'express'
import { getStudents, createStudent } from '../controllers/students.controller'

const router = Router()

router.get('/', getStudents)
router.post('/', createStudent)

export default router
