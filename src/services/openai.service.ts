import OpenAI from 'openai'

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
})

export const generateMessage = async (prompt: string) => {
	const completion = await client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: 'You write short, friendly messages for programming lessons.',
			},
			{ role: 'user', content: prompt },
		],
	})

	return completion.choices[0].message.content
}
