import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

import dotenv from 'dotenv'
import { prisma } from './prisma'
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// --- Дані для тесту ---
let students = [
	{ id: 1, name: 'Максим', tgId: '123456789' },
	{ id: 2, name: 'Антон', tgId: '987654321' },
]

let lessons = [
	{
		id: 1,
		groupId: 1,
		title: 'Scratch урок',
		date: '2025-11-30T18:00:00.000Z',
		homework: 'Спробувати анімацію',
	},
]

// --- Маршрути ---
app.get('/ping', (req: Request, res: Response) => res.send('pong'))

app.get('/students', (req: Request, res: Response) => res.json(students))
app.post('/students', (req: Request, res: Response) => {
	const newStudent = { id: students.length + 1, ...req.body }
	students.push(newStudent)
	res.json(newStudent)
})

app.get('/lessons', (req: Request, res: Response) => res.json(lessons))
app.post('/lessons', (req: Request, res: Response) => {
	const newLesson = { id: lessons.length + 1, ...req.body }
	lessons.push(newLesson)
	res.json(newLesson)
})
app.post('/lessons/sent', async (req: Request, res: Response) => {
	const { lessonId } = req.body

	try {
		const lesson = await prisma.lesson.update({
			where: { id: lessonId },
			data: { sentToTelegram: true },
		})
		res.json(lesson)
	} catch (error) {
		res.status(404).json({ message: 'Lesson not found' })
	}
})

// --- Telegram Cron (через setInterval) ---
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID // Твій chat_id або група

// const TELEGRAM_BOT_TOKEN = '8162378230:AAHyRPJ35RCKJRlrSUEsZ2rvRtoVi0LGtLw'
// const TELEGRAM_CHAT_ID = '595122514'

function sendTelegramMessage(text: string) {
	if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
	axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text }).catch(console.error)
}

// Надсилаємо повідомлення що 10 хв (600_000 ms)
setInterval(() => {
	const now = new Date()
	sendTelegramMessage(`Пам'ятай про уроки! Час: ${now.toLocaleTimeString()}`)
}, 600_000)

// --- Start server ---
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})

app.post('/send-telegram', async (req: Request, res: Response) => {
	const { text } = req.body
	if (!text) {
		return res.status(400).json({ message: 'Text is required' })
	}

	try {
		await sendTelegramMessage(text)
		res.json({ message: 'Message sent!' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Failed to send message' })
	}
})
