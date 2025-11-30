import dotenv from 'dotenv'
dotenv.config()

import axios from 'axios'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// const TELEGRAM_BOT_TOKEN = '8162378230:AAHyRPJ35RCKJRlrSUEsZ2rvRtoVi0LGtLw'
// const TELEGRAM_CHAT_ID = '595122514'

export async function sendTelegramMessage(text: string) {
	if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
		console.error('Telegram token or chat ID not set')
		return
	}

	try {
		await axios.post(
			`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				chat_id: TELEGRAM_CHAT_ID,
				text,
			}
		)
		console.log('Telegram message sent:', text)
	} catch (error) {
		console.error('Telegram send error:', error)
	}
}
