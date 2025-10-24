export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, apiKey } = req.body;

    if (!messages || !apiKey) {
      return res.status(400).json({ error: 'Messages and API key are required' });
    }

    // Call SuperNinja API
    const response = await fetch('https://api.myninja.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'superninja',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'SuperNinja API error');
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({
      message: reply,
      tokensUsed: data.usage?.total_tokens || 0,
    });

  } catch (error) {
    console.error('SuperNinja API error:', error);
    return res.status(500).json({ 
      error: error.message,
      message: "I apologize, but I'm having trouble connecting right now. Please check your API configuration and try again."
    });
  }
}