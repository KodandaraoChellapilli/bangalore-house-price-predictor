import { AnimatePresence, motion } from 'framer-motion'
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { getAssistantReply } from '../services/aiAssistant'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  'Best areas in Bangalore to invest?',
  'What is rental yield?',
  'Explain EMI simply',
  'Should I buy or rent?',
  'Good areas under ₹80 Lakhs?',
  'How is Whitefield market?',
]

function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm EstateIQ AI. Ask me about Bangalore property investment, ROI, EMI, rental yield, or neighborhood trends.",
    },
  ])
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !typing, [input, typing])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }

  const sendMessage = async (text: string) => {
    const cleanText = text.trim()
    if (!cleanText || typing) {
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: cleanText,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setTyping(true)
    scrollToBottom()

    const { reply } = await getAssistantReply(cleanText)

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: reply,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setTyping(false)
    scrollToBottom()
  }

  return (
    <div id="assistant" className="fixed bottom-6 right-6 z-[80]">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 shadow-2xl shadow-cyan-500/10 backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">EstateIQ AI</p>
                  <p className="text-xs text-slate-400">Real Estate Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-[340px] space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'bg-slate-800/70 text-slate-100'
                      : 'ml-auto bg-cyan-400 text-slate-950'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {typing && (
                <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-800/70 px-3.5 py-2 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400"
                    style={{ animationDelay: '120ms' }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400"
                    style={{ animationDelay: '220ms' }}
                  />
                  Thinking...
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void sendMessage(input)
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about ROI, EMI, or locations..."
                  className="h-10 flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-2xl shadow-cyan-500/35"
        aria-label="Open AI assistant"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        {!isOpen && (
          <span className="pointer-events-none absolute -left-36 top-1/2 hidden -translate-y-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-lg group-hover:block">
            Ask EstateIQ AI
          </span>
        )}
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 rounded-full bg-slate-950 p-1 text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        )}
      </motion.button>
    </div>
  )
}

export default AIChatAssistant
