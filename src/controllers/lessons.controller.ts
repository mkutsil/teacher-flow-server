import { prisma } from '../prisma'
import { Request, Response } from 'express'

export const getLessons = async (req: Request, res: Response) => {
	const lessons = await prisma.lesson.findMany({
		include: {
			group: true,
		},
	})

	res.json(lessons)
}

export const createLesson = async (req: Request, res: Response) => {
	const { groupId, date, title, homework } = req.body

	const lesson = await prisma.lesson.create({
		data: {
			groupId,
			date: new Date(date),
			title,
			homework,
		},
	})

	res.json(lesson)
}

export const markLessonSent = async (req: Request, res: Response) => {
	const { lessonId } = req.body

	const lesson = await prisma.lesson.update({
		where: { id: lessonId },
		data: { sentToTelegram: true },
	})

	res.json(lesson)
}
