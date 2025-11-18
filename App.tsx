import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from './types';
import { sendMessageStream } from './services/geminiService';

const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    pressure: 1012.5,
    temp: 358.2,
    load: 45.7,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => ({
        pressure: 1012.5 + (Math.random() - 0.5) * 5,
        temp: 358.2 + (Math.random() - 0.5) * 2,
        load: Math.max(20, Math.min(95, prevMetrics.load + (Math.random() - 0.5) * 10)),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const renderBar = (value: number, max: number, length: number = 12) => {
    const filledCount = Math.round((value / max) * length);
    const emptyCount = Math.max(0, length - filledCount);
    const filled = '❚'.repeat(filledCount);
    const empty = '-'.repeat(emptyCount);
    return `[${filled}${empty}]`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-1 border-y-2 border-amber-800/50 bg-black/30 text-xs sm:text-sm relative z-10">
      <div className="text-center px-1">
        <p className="text-amber-600">AETHER PRESSURE</p>
        <div className="flex justify-center items-center gap-2">
            <pre className="text-amber-400 text-[10px] sm:text-xs">{renderBar(metrics.pressure - 1000, 25)}</pre>
            <span>{metrics.pressure.toFixed(1)} hPa</span>
        </div>
      </div>
      <div className="text-center px-1">
        <p className="text-amber-600">CORE TEMP</p>
        <div className="flex justify-center items-center gap-2">
            <pre className="text-amber-400 text-[10px] sm:text-xs">{renderBar(metrics.temp - 300, 100)}</pre>
            <span>{metrics.temp.toFixed(1)} K</span>
        </div>
      </div>
      <div className="text-center px-1">
        <p className="text-amber-600">COGITO-ENGINE LOAD</p>
        <div className="flex justify-center items-center gap-2">
            <pre className="text-amber-400 text-[10px] sm:text-xs">{renderBar(metrics.load, 100)}</pre>
            <span>{metrics.load.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

const ScrollingTicker: React.FC = () => {
    const tickerText = "SYSTEM STATUS: ALL SYSTEMS NOMINAL... AETHER FLOW STABLE... CHRONOMETERS SYNCHRONIZED... MONITORING COGITO-ENGINE OUTPUT... VERIFYING STEAM PRESSURE... CALIBRATING BABBAGE-ENGINE... QUANTUM-LOCK SECURE... AWAITING OPERATOR INPUT... STANDBY FOR DIRECTIVES...   ";
    
    return (
        <div className="flex overflow-x-hidden border-b-2 border-amber-800/50 bg-black/30 text-amber-500 text-xs sm:text-sm whitespace-nowrap">
            <div className="animate-marquee py-1 flex-shrink-0">
                <span className="mx-4">{tickerText}</span>
            </div>
            <div className="animate-marquee py-1 flex-shrink-0">
                <span className="mx-4">{tickerText}</span>
            </div>
             <div className="animate-marquee py-1 flex-shrink-0">
                <span className="mx-4">{tickerText}</span>
            </div>
        </div>
    );
};

const Header: React.FC = () => (
  <header className="text-center text-amber-400 font-mono relative overflow-hidden flex-shrink-0 flex flex-col w-full border-b-2 border-amber-900/40">
    <div className="w-full bg-black/20 py-4 relative">
        {/* Decorative side lines for coordination */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-900/50 to-transparent opacity-50 hidden sm:block"></div>
        <div className="absolute right-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-900/50 to-transparent opacity-50 hidden sm:block"></div>
        
        <pre className="font-black text-[5px] min-[400px]:text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] text-amber-500 leading-[1.1] select-none tracking-tight drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
{`
 ██████╗  ██████╗  ██████╗ ███████╗
██╔════╝ ██╔═══██╗██╔════╝ ██╔════╝
██║      ██║   ██║██║  ███╗███████╗
██║      ██║   ██║██║   ██║╚════██║
╚██████╗ ╚██████╔╝╚██████╔╝███████║
 ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝
`}
        </pre>
        <div className="mt-1 sm:mt-3 flex items-center justify-center gap-3 text-amber-700 text-[8px] sm:text-[10px] font-bold tracking-[0.25em] uppercase opacity-90">
             <span className="text-amber-800">//</span>
             <span>Cybernetic Omniscient Gear-driven Sentinel</span>
             <span className="text-amber-800">//</span>
        </div>
    </div>
    <SystemMetrics />
    <ScrollingTicker />
  </header>
);

const CRTEffects: React.FC = () => (
    <>
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]" style={{ boxShadow: 'inset 0 0 8rem 2rem rgba(0,0,0,0.8)' }}></div>
      {/* Pixel Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(18, 16, 16, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18, 16, 16, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '2px 2px',
        }}
      ></div>
      {/* Flicker */}
      <div className="pointer-events-none absolute inset-0 z-10 animate-flicker bg-black/10"></div>
    </>
);


const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    let isCancelled = false;

    const bootAndInit = async () => {
      const bootSequence = [
        "从太调制器... | Calibrating Aetheric Modulators...",
        "管道加压... 正常 | Pressurizing Steam Conduits... OK",
        "认知引擎... | Engaging Cogito Engine...",
        "计时器... | Syncing Chronometers...",
        "C.O.G.S. 界面加载完毕 | C.O.G.S. Interface Loaded.",
      ];
      
      const initialAiMessageContent = "C.O.G.S. ONLINE. AWAITING DIRECTIVES, OPERATOR.\n// TRANSMISSION END //";

      try {
        // 1. Run boot sequence visually
        for (const line of bootSequence) {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 250 + 50));
          if (isCancelled) return;
          setMessages(prev => [...prev, { id: nextId.current++, role: MessageRole.SYSTEM, content: line, timestamp: new Date().toLocaleTimeString() }]);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
        if (isCancelled) return;

        // 2. Display the hardcoded initial AI message with a typing animation
        const modelMessageId = nextId.current++;
        const modelMessage: ChatMessage = {
          id: modelMessageId,
          role: MessageRole.MODEL,
          content: '▋',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, modelMessage]);

        let text = '';
        for (let i = 0; i < initialAiMessageContent.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 25));
            if (isCancelled) return;
            text = initialAiMessageContent.substring(0, i + 1);
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, content: text + '▋' } : msg
            ));
        }
        
        if (isCancelled) return;
        setMessages(prev => prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, content: initialAiMessageContent } : msg
        ));

      } catch (error) {
        if (isCancelled) return;
        console.error("Error during boot sequence:", error);
        const errorMessage: ChatMessage = {
          id: nextId.current++,
          role: MessageRole.SYSTEM,
          content: "系统错误: 无法连接 C.O.G.S. 核心 | SYSTEM ERROR: Failed to contact C.O.G.S. core.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        if (isCancelled) return;
        setIsBooting(false);
      }
    };

    bootAndInit();

    return () => {
        isCancelled = true;
    };
  }, []); 

  const lastMessageContent = messages.length > 0 ? messages[messages.length - 1].content : null;
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length]); // Optimized scroll dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isBooting) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: MessageRole.USER,
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageStream(input);
      let text = '';
      const modelMessageId = nextId.current++;
      const modelMessage: ChatMessage = {
          id: modelMessageId,
          role: MessageRole.MODEL,
          content: '▋',
          timestamp: new Date().toLocaleTimeString(),
        };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        text += chunk.text;
         setMessages(prev => prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, content: text + '▋' } : msg
        ));
      }
      
      setMessages(prev => prev.map(msg =>
        msg.id === modelMessageId ? { ...msg, content: text } : msg
      ));

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: ChatMessage = {
        id: nextId.current++,
        role: MessageRole.SYSTEM,
        content: "传输错误: 未能获取响应 | TRANSMISSION ERROR: Could not get a response.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-900 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Outer Bezel */}
        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-[3rem] shadow-2xl shadow-black border-t-2 border-zinc-700">
            {/* Inner Bezel / Shadow */}
            <div className="bg-black p-1 sm:p-2 rounded-[2.5rem]">
                {/* The Screen element */}
                <div className="w-[94vw] h-[88vh] max-w-[1600px] bg-black text-amber-400 font-mono flex flex-col antialiased relative rounded-[2.2rem] border-4 border-zinc-800 shadow-[0_0_6rem_rgba(251,191,36,0.15),_inset_0_0_2rem_rgba(0,0,0,0.8)] overflow-hidden">
                <CRTEffects />
                <Header />
                <main className="flex-1 flex flex-col p-2 md:p-4 overflow-y-auto">
                    <div className="flex-1 space-y-4">
                        {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.role === MessageRole.USER && (
                                <pre className="whitespace-pre-wrap text-lg md:text-xl text-green-400">
                                    <span className="text-cyan-400">OPERATOR:/~> </span>{msg.content}
                                </pre>
                            )}
                            {msg.role === MessageRole.MODEL && (
                                <pre className={`whitespace-pre-wrap text-lg md:text-xl`}>
                                {msg.content}
                                </pre>
                            )}
                            {msg.role === MessageRole.SYSTEM && (
                                <pre className={`whitespace-pre-wrap text-lg md:text-xl text-amber-400/80`}>
                                <span className="text-amber-600">[SYSTEM] </span>{msg.content}
                                </pre>
                            )}
                        </div>
                        ))}
                         <div ref={chatEndRef} />
                    </div>
                </main>
                {!isBooting && (
                    <footer className="p-2 md:p-4 flex-shrink-0">
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-2 border-2 border-cyan-400/80 p-2 bg-black/30 rounded-sm">
                                <label htmlFor="userInput" className="text-cyan-400 text-lg md:text-xl whitespace-nowrap">OPERATOR:/~> </label>
                                <input
                                id="userInput"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isLoading ? "等待响应..." : "Enter directive..."}
                                disabled={isLoading}
                                className="flex-1 bg-transparent border-0 focus:ring-0 text-amber-400 placeholder-amber-600/70 caret-amber-400 text-lg md:text-xl"
                                autoFocus
                                />
                            </div>
                             <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-full mt-2 p-2 text-xl font-bold bg-transparent text-green-400 rounded-sm border-2 border-green-400/80 hover:bg-green-400 hover:text-black disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700 disabled:cursor-not-allowed transition-colors"
                            >
                                传输 | TRANSMIT
                            </button>
                        </form>
                    </footer>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default App;