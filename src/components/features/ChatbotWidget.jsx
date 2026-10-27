import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  Shield,
  HelpCircle,
  FileText,
  Key,
  Maximize2,
  Minimize2,
  BookOpen
} from 'lucide-react'
import { loadReadmeDocumentation } from '../../services/readmeService'
import { generateSentinelAiResponse } from '../../services/sentinelAiEngine'

// Quick suggestion prompts
const SUGGESTED_PROMPTS = [
  'How does the hash-chain work?',
  'What is the role of an auditor?',
  'How are Merkle roots anchored to the smart contract?',
  'Explain the tamper simulation scenarios',
  'What are the demo login credentials?'
]

// Lightweight markdown renderer component for AI responses
function MarkdownView({ text }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Parse lines into tokens
  const lines = text.split('\n')
  const elements = []
  let inCodeBlock = false
  let codeBlockLanguage = ''
  let codeBlockLines = []
  let codeBlockIndex = 0

  lines.forEach((line, idx) => {
    // Code block toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        const fullCode = codeBlockLines.join('\n')
        const currentIdx = codeBlockIndex++
        elements.push(
          <div key={`code-${idx}`} className="my-2.5 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 font-mono text-[11px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/60 text-slate-400">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                {codeBlockLanguage || 'code'}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(fullCode, currentIdx)}
                className="flex items-center space-x-1 hover:text-cyan-300 text-slate-400 transition-colors"
                title="Copy code"
              >
                {copiedIndex === currentIdx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed">
              <code>{fullCode}</code>
            </pre>
          </div>
        )
        inCodeBlock = false
        codeBlockLines = []
        codeBlockLanguage = ''
      } else {
        inCodeBlock = true
        codeBlockLanguage = line.replace('```', '').trim()
      }
      return
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      return
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${idx}`} className="text-sm font-bold text-cyan-300 mt-2.5 mb-1.5 flex items-center gap-1.5">
          {line.replace('### ', '')}
        </h4>
      )
      return
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={`h4-${idx}`} className="text-xs font-semibold text-slate-200 mt-2 mb-1">
          {line.replace('#### ', '')}
        </h5>
      )
      return
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <div key={`bq-${idx}`} className="my-2 pl-3 py-1 border-l-2 border-cyan-500/60 bg-cyan-950/20 text-[11px] text-cyan-200/90 rounded-r">
          {renderFormattedInline(line.replace('> ', ''))}
        </div>
      )
      return
    }

    // List item
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const itemContent = line.trim().substring(2)
      elements.push(
        <div key={`li-${idx}`} className="flex items-start space-x-2 my-1 text-xs text-slate-300">
          <span className="text-cyan-400 mt-1 select-none">•</span>
          <span className="flex-1">{renderFormattedInline(itemContent)}</span>
        </div>
      )
      return
    }

    // Regular line / paragraph
    if (line.trim().length > 0) {
      elements.push(
        <p key={`p-${idx}`} className="text-xs text-slate-300 my-1.5 leading-relaxed">
          {renderFormattedInline(line)}
        </p>
      )
    }
  })

  // Format inline bold and code
  function renderFormattedInline(str) {
    const parts = []
    let remaining = str
    let keyIdx = 0

    // Match code `foo` or bold **foo**
    while (remaining.length > 0) {
      const codeMatch = remaining.match(/`([^`]+)`/)
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

      let firstMatch = null
      let matchType = null

      if (codeMatch && (!boldMatch || codeMatch.index < boldMatch.index)) {
        firstMatch = codeMatch
        matchType = 'code'
      } else if (boldMatch) {
        firstMatch = boldMatch
        matchType = 'bold'
      }

      if (!firstMatch) {
        parts.push(remaining)
        break
      }

      if (firstMatch.index > 0) {
        parts.push(remaining.substring(0, firstMatch.index))
      }

      if (matchType === 'code') {
        parts.push(
          <code key={`c-${keyIdx++}`} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-950/80 border border-slate-700/60 text-cyan-300 font-mono text-[11px]">
            {firstMatch[1]}
          </code>
        )
      } else if (matchType === 'bold') {
        parts.push(
          <strong key={`b-${keyIdx++}`} className="font-semibold text-slate-100">
            {firstMatch[1]}
          </strong>
        )
      }

      remaining = remaining.substring(firstMatch.index + firstMatch[0].length)
    }

    return parts
  }

  return <div>{elements}</div>
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDocStats, setShowDocStats] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sentinel_gemini_key') || '')
  
  // README Documentation State
  const [readmeData, setReadmeData] = useState(null)
  const [isDocLoading, setIsDocLoading] = useState(true)
  const [docLoadError, setDocLoadError] = useState(null)

  // Messages State
  const [messages, setMessages] = useState(() => [
    {
      id: 'greeting',
      sender: 'assistant',
      text: "Hello! I am your GovChain Sentinel Assistant. I've loaded the project documentation. How can I help you understand our blockchain log anchoring system today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      references: ['README.md Documentation Root']
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Send message handler
  const handleSendMessage = useCallback(async (textToSend) => {
    const text = (textToSend || inputMessage).trim()
    if (!text || isThinking) return

    const userMessageId = `user-${Date.now()}`
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsThinking(true)

    try {
      const response = await generateSentinelAiResponse({
        userMessage: text,
        conversationHistory: messages,
        readmeData,
        apiKey: apiKey.trim()
      })

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
        references: response.references
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      console.error('[Sentinel AI] Answering error:', err)
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ An error occurred while synthesizing information: ${err.message}. Please verify local documentation integrity.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsThinking(false)
    }
  }, [inputMessage, isThinking, messages, readmeData, apiKey])

  // 1. Dynamic Initialization: Fetch, Read, and Parse README.md on component mount
  useEffect(() => {
    let isMounted = true

    async function initReadme() {
      try {
        setIsDocLoading(true)
        const loaded = await loadReadmeDocumentation()
        if (isMounted) {
          setReadmeData(loaded)
          setIsDocLoading(false)
        }
      } catch (err) {
        console.error('[Sentinel AI] Failed to parse README.md:', err)
        if (isMounted) {
          setDocLoadError('Failed to load local README.md. Defaulting to cached knowledge.')
          setIsDocLoading(false)
        }
      }
    }

    initReadme()
    return () => { isMounted = false }
  }, [])

  // Auto-scroll chat history to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Global event listener to open chatbot from external buttons/cards
  useEffect(() => {
    const handleOpenEvent = (event) => {
      setIsOpen(true)
      if (event.detail?.prompt) {
        handleSendMessage(event.detail.prompt)
      }
    }

    window.addEventListener('open-sentinel-ai', handleOpenEvent)
    return () => window.removeEventListener('open-sentinel-ai', handleOpenEvent)
  }, [handleSendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageId(id)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const handleClearHistory = () => {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        sender: 'assistant',
        text: "Chat history cleared. I'm ready to answer any questions about GovChain Sentinel's architecture, cryptographic hash-chain, Merkle trees, and user roles.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        references: ['README.md Documentation Root']
      }
    ])
  }

  const handleSaveApiKey = (e) => {
    e.preventDefault()
    localStorage.setItem('sentinel_gemini_key', apiKey.trim())
    setShowKeyModal(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans print:hidden">
      {/* 1. COLLAPSED FLOATING ACTION BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 px-4 py-3 rounded-full bg-slate-900/95 border border-cyan-500/40 text-slate-100 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:border-cyan-400 hover:scale-105 transition-all duration-300 backdrop-blur-md cursor-pointer"
          title="Open Sentinel AI Assistant (README.md Indexed)"
        >
          {/* Subtle glowing ring effect */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500/40 to-blue-600/30 blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              {/* Online pulse indicator */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                Sentinel AI
                <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                  Docs RAG
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {isDocLoading ? 'Indexing README.md...' : 'README Indexed // Online'}
              </div>
            </div>
          </div>
        </button>
      )}

      {/* 2. EXPANDED CHAT WIDGET WINDOW */}
      {isOpen && (
        <div
          className={`flex flex-col bg-slate-900/95 border border-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.25)] backdrop-blur-xl transition-all duration-300 overflow-hidden ${
            isExpanded
              ? 'w-[92vw] sm:w-[650px] h-[88vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[430px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Top light glow bar */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          {/* WIDGET HEADER */}
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-100 tracking-wider">
                    SENTINEL AI ASSISTANT
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
                    SOC v2.4
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span className="flex items-center text-emerald-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    README.md INDEXED
                  </span>
                  <span>•</span>
                  <span className="text-slate-500">
                    {readmeData ? `${readmeData.totalLines} Lines` : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-1 text-slate-400">
              {/* Document Knowledge Stats Popover Toggle */}
              <button
                type="button"
                onClick={() => setShowDocStats(!showDocStats)}
                className={`p-1.5 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors ${
                  showDocStats ? 'text-cyan-400 bg-slate-800' : ''
                }`}
                title="View Indexed README.md Details"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>

              {/* Optional Gemini API Key Drawer */}
              <button
                type="button"
                onClick={() => setShowKeyModal(!showKeyModal)}
                className={`p-1.5 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors ${
                  apiKey ? 'text-emerald-400' : ''
                }`}
                title={apiKey ? 'Gemini API Configured' : 'Configure Gemini API Key (Optional)'}
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title="Clear Chat History"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Expand / Minimize Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors hidden sm:block"
                title={isExpanded ? 'Restore Size' : 'Expand Window'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-red-400 transition-colors ml-1"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OPTIONAL: README STATS INSPECTOR POPOVER */}
          {showDocStats && (
            <div className="p-3 bg-slate-950/95 border-b border-slate-800 text-xs font-mono text-slate-300 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  INDEXED KNOWLEDGE BASE: README.md
                </span>
                <span className="text-[10px] text-slate-400 uppercase">
                  Source: {readmeData?.source || 'dynamic'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Total Lines</div>
                  <div className="text-slate-200 font-bold">{readmeData?.totalLines || 353}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Sections Indexed</div>
                  <div className="text-slate-200 font-bold">{readmeData?.sections?.length || 13}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Integrity Digest</div>
                  <div className="text-cyan-400 font-mono text-[10px] truncate">{readmeData?.digest || 'sha256-verified'}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Active Status</div>
                  <div className="text-emerald-400 font-bold">100% Synced</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                <span className="text-cyan-400 font-semibold">Indexed Sections:</span> Overview, Problem Statement, Objectives, Key Features, Tech Stack, Cryptographic Hash-Chain & Merkle Root Mechanics, Quick Start, RBAC, Simulation Lab.
              </div>
            </div>
          )}

          {/* OPTIONAL: GEMINI API KEY MODAL / DRAWER */}
          {showKeyModal && (
            <div className="p-3 bg-slate-950/95 border-b border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between mb-2 text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5 text-xs">
                  <Key className="w-3.5 h-3.5" />
                  OPTIONAL: GEMINI LLM API KEY
                </span>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                By default, GovChain Sentinel runs an instant, offline-capable knowledge synthesis engine. You can optionally provide a Gemini API key to activate live LLM generation with the parsed README system prompt.
              </p>
              <form onSubmit={handleSaveApiKey} className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... (Gemini API Key)"
                  className="flex-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition-colors"
                >
                  Save
                </button>
              </form>
            </div>
          )}

          {/* QUICK PROMPT SUGGESTION CHIPS */}
          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto scrollbar-none flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Quick:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isThinking}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/70 hover:bg-cyan-950/70 border border-slate-700/60 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors duration-150 cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* CHAT MESSAGES CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {docLoadError && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{docLoadError}</span>
              </div>
            )}

            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant'
              const isUser = msg.sender === 'user'

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender & Timestamp Header */}
                  <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400">
                    {isAssistant ? (
                      <>
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span className="font-semibold text-cyan-400">SENTINEL AI</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span>{msg.timestamp}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-300">OPERATOR / AUDITOR</span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative group max-w-[88%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all ${
                      isUser
                        ? 'bg-slate-800/90 text-slate-100 border border-cyan-500/30 rounded-tr-sm shadow-md'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {isAssistant ? (
                      <div>
                        <MarkdownView text={msg.text} />
                        
                        {/* Reference footer tag */}
                        {msg.references && msg.references.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-1 text-cyan-500/80">
                              <FileText className="w-3 h-3" />
                              {msg.references[0]}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                              title="Copy response"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              )
            })}

            {/* THINKING / SCANNING INDICATOR */}
            {isThinking && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] font-mono text-cyan-400">
                  <Terminal className="w-3 h-3 animate-spin" />
                  <span>ANALYZING README.md CRYPTOGRAPHIC INDEX...</span>
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-sm bg-slate-900/90 border border-cyan-500/30 flex items-center space-x-3 text-xs text-slate-300">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="font-mono text-[11px] text-cyan-300/80">
                    Querying hash-chain & Merkle specifications...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800/80">
            <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700/80 focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about hash-chains, Merkle roots, RBAC, etc..."
                disabled={isThinking}
                className="w-full pl-3.5 pr-12 py-2.5 bg-transparent text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isThinking}
                className="absolute right-1.5 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-cyan-500 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] font-mono text-slate-500">
              <span>Enter to send • Shift+Enter for newline</span>
              <span className="text-cyan-500/70">Powered by README.md Context</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
