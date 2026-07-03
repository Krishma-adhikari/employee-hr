import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';
import { Send, Sparkles, User, Loader2, RefreshCw } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What are the primary drivers of attrition in our Sales department?',
  'Suggest a retention playbook for an employee working heavy overtime.',
  'How do job satisfaction levels affect employee turnover rates in our company?',
  'Draft a 6-month talent retention strategy for Research Scientists.'
];

export default function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        sender: 'ai',
        text: "Hello! I am **Krishma**, your HR Analytics and Talent Retention Consultant. I have reviewed our company's aggregate headcount findings (including department attrition, overtime trends, and satisfaction levels).\n\nHow can I help you optimize our workplace culture, address attrition hotspots, or design personalized stay interview frameworks today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setLoading(true);

    try {
      // Map message history to Gemini API format: [{ role: 'user' | 'model', parts: [{ text: string }] }]
      const apiMessages = [
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: textToSend }]
        }
      ];

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete chat');
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        sender: 'ai',
        text: `**System Error:** ${err.message || 'I am having trouble connecting to my cognitive services right now. Please ensure your Gemini API key is configured correctly in Secrets.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: "Chat history cleared. I'm ready for our next HR consultation. What's on your agenda?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
      {/* Suggestions Column - Left (4 cols) */}
      <div className="lg:col-span-4 bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-500">
            <Sparkles size={18} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Krishma Partner</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            I am context-primed with our real workforce aggregate analytics. Ask me to cross-reference overtime trends, draft specific HR communications, design role policies, or analyze satisfaction levels.
          </p>

          <div className="space-y-2 mt-6">
            <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Suggested consultations</span>
            {SUGGESTED_QUESTIONS.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(question)}
                disabled={loading}
                className="w-full text-left text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 text-slate-600 dark:text-slate-300 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 transition-all cursor-pointer disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="w-full mt-6 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800/60 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
        >
          <RefreshCw size={12} />
          Reset Consultation
        </button>
      </div>

      {/* Chat Conversation Column - Right (8 cols) */}
      <div className="lg:col-span-8 bg-white dark:bg-[#0F1219]/50 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-[#0F1219]/70">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-sans font-medium text-slate-800 dark:text-slate-200">Krishma AI Partner</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">GEMINI POWERED</span>
        </div>

        {/* Message window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="bg-indigo-100 dark:bg-indigo-950 text-indigo-500 w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold">
                  K
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/60 rounded-tl-none'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300">
                    <Markdown
                      components={{
                        p: ({ children }) => <p className="mb-2 leading-relaxed whitespace-pre-wrap last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        h1: ({ children }) => <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2.5 mb-1">{children}</h2>,
                        strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>,
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  </div>
                )}
                <span className={`block text-[9px] font-mono mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="bg-indigo-100 dark:bg-indigo-950 text-indigo-500 w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="bg-indigo-100 dark:bg-indigo-950 text-indigo-500 w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold">
                K
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="animate-spin text-indigo-500" size={14} />
                <span className="text-xs font-mono text-slate-400">Astra is formulating recommendations...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0F1219]/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(userInput);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
              placeholder="Ask about retention playbooks, turnover metrics, stay-interview designs..."
              className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
