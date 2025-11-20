import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, model = 'gpt-4-turbo', max_tokens = 2000, temperature = 0.7 } = req.body;

        const completion = await openai.chat.completions.create({
            model,
            messages,
            max_tokens,
            temperature,
        });

        res.status(200).json({
            success: true,
            response: completion.choices[0].message,
            usage: completion.usage
        });

    } catch (error) {
        console.error('OpenAI Chat Error:', error);
        res.status(500).json({ 
            error: 'Failed to process chat completion',
            details: error.message 
        });
    }
}