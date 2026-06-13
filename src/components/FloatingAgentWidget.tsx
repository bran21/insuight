import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  sender: 'user' | 'friar';
  text: string;
};

export default function FloatingAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'friar', text: 'Hello! I am Friar, your AI prediction assistant. How can I help you find an edge today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let reply = "I'm analyzing on-chain signals for that. My prediction models indicate a 65% probability of YES.";
      if (userMsg.toLowerCase().includes('train')) {
        reply = "Initiating my self-improvement training loop on recent Sui data...";
        setIsTraining(true);
        setTimeout(() => setIsTraining(false), 3000);
      } else if (userMsg.toLowerCase().includes('help')) {
        reply = "I can analyze market probabilities, fetch recent oracle prices, and suggest trades based on historical data. What market are you looking at?";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'friar', text: reply }]);
    }, 1500);
  };

  const handleTrain = () => {
    setIsTraining(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'friar', text: '[System]: Initiating neural weight updates based on recent mainnet outcomes...' }]);
    setTimeout(() => {
      setIsTraining(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'friar', text: '[System]: Training complete. My models are now 4.2% more accurate.' }]);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[340px] md:w-[380px] h-[500px] max-h-[80vh] bg-bg-card border border-border rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-4 border-b border-border bg-bg-secondary/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent relative">
                🤖
                {isTraining && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green rounded-full animate-ping" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-text-primary m-0">Friar</h3>
                <p className="text-[10px] text-text-muted m-0 uppercase tracking-widest">{isTraining ? 'Training...' : 'AI Assistant'}</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={handleTrain} className="text-xs px-2 py-1 bg-indigo-soft text-indigo rounded hover:bg-indigo/20 transition-colors border border-indigo/20" title="Train Friar">
                 Train
               </button>
               <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary">
                 ✕
               </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-primary/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user' ? 'bg-accent text-text-inverse rounded-tr-sm' : 'bg-bg-elevated border border-border text-text-primary rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-bg-elevated border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-bg-card">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Friar for predictions..."
                className="w-full bg-bg-secondary border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-accent text-text-inverse rounded-lg flex items-center justify-center hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↑
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_4px_24px_rgba(99,102,241,0.4)] flex items-center justify-center text-2xl hover:scale-105 transition-transform active:scale-95 border-2 border-white/10"
      >
        🤖
      </button>
    </div>
  );
}
