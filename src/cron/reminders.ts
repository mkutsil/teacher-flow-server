import cron from 'node-cron'
import { sendTelegramMessage } from '../services/telegram.service'

// Простий приклад: кожного дня о 18:00 шле нагадування в конкретний чат
export function startRemindersCron() {
	// приклад: щодня о 17:00 (синтаксис: m h dom mon dow)
	cron.schedule('0 17 * * *', async () => {
		try {
			const chatId = process.env.DEFAULT_CHAT_ID // або дістаємо з БД для кожної групи
			if (!chatId) return
			await sendTelegramMessage('Нагадування: завтра урок!')
			console.log('Reminder sent')
		} catch (err) {
			console.error('Cron error', err)
		}
	})
}
