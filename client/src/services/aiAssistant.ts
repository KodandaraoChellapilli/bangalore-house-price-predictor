const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
const OPENAI_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? 'gpt-4o-mini'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? 'gemini-1.5-flash'

const SYSTEM_PROMPT =
  'You are EstateIQ AI, a helpful Bangalore real estate assistant. Explain concepts in simple terms. Discuss ROI, rental yield, appreciation, EMI, budgeting, neighborhood comparison, and buy vs rent. Keep replies concise, practical, and non-legal.'

const fallbackKnowledge: Array<{ pattern: RegExp; response: string }> = [
  {
    pattern: /rental yield/i,
    response:
      'Rental yield = annual rent / property price x 100. In Bangalore, gross yields often sit around 3% to 5% depending on micro-location, demand, and tenant profile.',
  },
  {
    pattern: /roi|return on investment/i,
    response:
      'For property ROI, combine rental cash flow + appreciation. Compare this against loan cost, maintenance, vacancy, and opportunity cost before deciding.',
  },
  {
    pattern: /emi/i,
    response:
      'EMI is your fixed monthly loan payment. It includes principal + interest. A common safety rule is to keep total EMIs under 35% to 40% of monthly net income.',
  },
  {
    pattern: /whitefield/i,
    response:
      'Whitefield remains one of Bangalore\'s strongest corridors due to tech employment, metro expansion, and rental demand. Micro-market and exact project quality still matter a lot.',
  },
  {
    pattern: /buy or rent/i,
    response:
      'Buy if you plan to stay long term and can comfortably handle down payment + EMI. Rent if flexibility matters more and ownership costs would stretch your finances.',
  },
]

const defaultFallback =
  'I can help with Bangalore property investment, ROI, rental yield, EMI planning, and area comparisons. Ask me your budget and target location for a tailored suggestion.'

const buildFallbackResponse = (query: string) => {
  const matched = fallbackKnowledge.find((item) => item.pattern.test(query))
  return matched?.response ?? defaultFallback
}

const askOpenAI = async (query: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    throw new Error('OpenAI request failed')
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content as string | undefined
}

const askGemini = async (query: string) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${SYSTEM_PROMPT}\n\nUser question: ${query}` }],
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    throw new Error('Gemini request failed')
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined
}

export const getAssistantReply = async (query: string): Promise<{ reply: string; mode: string }> => {
  try {
    if (OPENAI_API_KEY) {
      const response = await askOpenAI(query)
      if (response) {
        return { reply: response, mode: 'openai' }
      }
    }

    if (GEMINI_API_KEY) {
      const response = await askGemini(query)
      if (response) {
        return { reply: response, mode: 'gemini' }
      }
    }
  } catch {
    return { reply: buildFallbackResponse(query), mode: 'fallback' }
  }

  return { reply: buildFallbackResponse(query), mode: 'fallback' }
}
