
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { getAIInsights } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const AIAssistant: React.FC<{ state: AppState }> = ({ state }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'أهلاً بك! أنا مساعدك الذكي في الورشة. يمكنني مساعدتك في تحليل مبيعاتك، حساب أرباحك، أو تذكيرك بنقص المواد. كيف أساعدك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const aiResponse = await getAIInsights(state, userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    setLoading(false);
  };

  const quickPrompts = ["ما هي أرباحي الصافية؟", "ملخص عمل الورشة", "تنبيهات المخزن"];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="bg-indigo-600 p-4 rounded-2xl mb-4 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full"><Sparkles size={20} /></div>
        <div>
          <h3 className="text-sm font-bold">ذكاء الورشة الاصطناعي</h3>
          <p className="text-[10px] text-indigo-100">بواسطة Gemini AI - جاهز للمساعدة</p>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar pb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl flex gap-2 ${m.role === 'user' ? 'bg-white border border-slate-100 rounded-tr-sm text-slate-700' : 'bg-indigo-50 text-indigo-900 rounded-tl-sm'}`}>
              <div className="shrink-0">{m.role === 'bot' ? <Bot size={18} className="text-indigo-600" /> : <User size={18} className="text-slate-400" />}</div>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-indigo-50 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-600" /><span className="text-xs text-indigo-600">جاري التفكير...</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickPrompts.map(p => <button key={p} onClick={() => { setInput(p); }} className="whitespace-nowrap bg-white px-4 py-2 rounded-full text-xs font-bold text-slate-500 border border-slate-100 shadow-sm active:bg-indigo-50 active:text-indigo-600">{p}</button>)}
        </div>
        <div className="relative">
          <input type="text" placeholder="اسألني عن مبيعاتك أو مصاريفك..." className="w-full pr-4 pl-14 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} disabled={loading} className="absolute left-2 top-2 bottom-2 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition-all disabled:bg-slate-300"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};
export default AIAssistant;
