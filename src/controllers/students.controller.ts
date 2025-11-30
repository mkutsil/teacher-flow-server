import { prisma } from '../prisma'
import { Request, Response } from 'express'

export const getStudents = async (req: Request, res: Response) => {
	const students = await prisma.student.findMany()
	res.json(students)
}

export const createStudent = async (req: Request, res: Response) => {
	const { name, tgId } = req.body

	const student = await prisma.student.create({
		data: { name },
	})

	res.json(student)
}
