
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageRole } from './types';
import { sendMessageStream } from './services/geminiService';

const Header: React.FC = () => (
  <header className="border-b-2 border-amber-700/50 p-2 text-center text-amber-400 font-mono relative overflow-hidden flex-shrink-0">
    <div className="absolute inset-0 bg-black/20 animate-pulse"></div>
    <pre className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-amber-500/90 leading-tight md:leading-tight">
{`
██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗      ██████╗ ██╗     
██╔══██╗██╔════╝████╗ ████║██║████╗  ██║██║     ██╔═══██╗██║     
██████╔╝█████╗  ██╔████╔██║██║██╔██╗ ██║██║     ██║   ██║██║     
██╔══██╗██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║     ██║   ██║██║     
██║  ██║███████╗██║ ╚═╝ ██║██║██║ ╚████║███████╗╚██████╔╝███████╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚══════╝
 C.O.G.S.  < C Y B E R N E T I C   O M N I S C I E N T   G E A R - D R I V E N   S E N T I N E L >
`}
    </pre>
  </header>
);

const SystemStatus: React.FC = () => {
    const [statusValues, setStatusValues] = useState({
        coreTemp: 75,
        pressure: 120,
        aetherFlux: 50,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusValues({
                coreTemp: 70 + Math.random() * 10,
                pressure: 115 + Math.random() * 10,
                aetherFlux: 45 + Math.random() * 10,
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const renderBar = (value: number) => {
        const numBars = Math.floor((value / 100) * 10);
        return '█'.repeat(numBars) + '░'.repeat(10 - numBars);
    };

    return (
        <div className="hidden lg:block w-60 border-l-2 border-r-2 border-amber-700/50 p-2 font-mono text-sm text-green-400 space-y-4">
            <h2 className="text-amber-400 text-center animate-pulse">[系统状态 | SYSTEM STATUS]</h2>
            <div>
                <p>认知核心温度 | COGITO CORE TEMP</p>
                <p className="text-green-300">{statusValues.coreTemp.toFixed(2)}° C</p>
                <p className="text-green-500 text-xs tracking-widest">{renderBar(statusValues.coreTemp)}</p>
            </div>
            <div>
                <p>蒸汽压力 | STEAM PRESSURE</p>
                <p className="text-green-300">{statusValues.pressure.toFixed(2)} PSI</p>
                 <p className="text-green-500 text-xs tracking-widest">{renderBar(statusValues.pressure - 50)}</p>
            </div>
            <div>
                <p>以太通量 | AETHER FLUX</p>
                <p className="text-green-300">{statusValues.aetherFlux.toFixed(2)} φ</p>
                 <p className="text-green-500 text-xs tracking-widest">{renderBar(statusValues.aetherFlux)}</p>
            </div>
            <div className="text-center pt-8">
                <div className="w-24 h-24 mx-auto border-4 border-amber-600 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-16 h-16 border-2 border-amber-600/70 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-500 rounded-full animate-ping"></div>
                    </div>
                </div>
                <p className="text-amber-400 mt-2 text-xs">AI 核心: 在线 | AI CORE: ONLINE</p>
            </div>
        </div>
    );
};

const CRTEffects: React.FC = () => (
    <>
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]" style={{ boxShadow: 'inset 0 0 8rem 2rem #000' }}></div>
      {/* Pixel Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(18, 16, 16, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18, 16, 16, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '3px 3px',
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

  const bootSequence = [
    "BIOS 版本 1.8.8.8 初始化... | BIOS Ver. 1.8.8.8 Initializing...",
    "校准以太调制器... | Calibrating Aetheric Modulators...",
    "蒸汽管道加压... 正常 | Pressurizing Steam Conduits... OK",
    "启动认知引擎... | Engaging Cogito Engine...",
    "同步计时器... | Syncing Chronometers...",
    "C.O.G.S. 界面加载完毕 | C.O.G.S. Interface Loaded.",
    "",
  ];

  useEffect(() => {
    let delay = 0;
    bootSequence.forEach((line, index) => {
        setTimeout(() => {
            setMessages(prev => [...prev, { role: MessageRole.SYSTEM, content: line, timestamp: new Date().toLocaleTimeString() }]);
            if (index === bootSequence.length - 1) {
                setTimeout(() => {
                    handleInitialMessage();
                }, 500);
            }
        }, delay);
        delay += Math.random() * 200 + 50;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInitialMessage = useCallback(async () => {
      setIsLoading(true);
      try {
        const stream = await sendMessageStream(''); // Send empty message to trigger initial response
        let text = '';
        const modelMessage: ChatMessage = {
          role: MessageRole.MODEL,
          content: '▋',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, modelMessage]);

        for await (const chunk of stream) {
            text += chunk.text;
            setMessages(prev =>
              prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: text + '▋' }
                  : msg
              )
            );
        }

        setMessages(prev =>
              prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: text }
                  : msg
              )
            );

      } catch (error) {
        console.error("Error during initial message:", error);
        const errorMessage: ChatMessage = {
          role: MessageRole.SYSTEM,
          content: "系统错误: 无法连接 C.O.G.S. 核心 | SYSTEM ERROR: Failed to contact C.O.G.S. core.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsBooting(false);
      }
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isBooting) return;

    const userMessage: ChatMessage = {
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
      const modelMessage: ChatMessage = {
          role: MessageRole.MODEL,
          content: '▋',
          timestamp: new Date().toLocaleTimeString(),
        };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        text += chunk.text;
         setMessages(prev =>
              prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: text + '▋' }
                  : msg
              )
            );
      }
      
      setMessages(prev =>
              prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: text }
                  : msg
              )
            );

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: ChatMessage = {
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
        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-[3.5rem] shadow-2xl shadow-black border-t-2 border-zinc-700">
            {/* Inner Bezel / Shadow */}
            <div className="bg-black p-1 sm:p-2 rounded-[2.8rem]">
                {/* The Screen element */}
                <div className="w-[94vw] h-[88vh] max-w-[1600px] bg-black text-green-400 font-mono flex flex-col antialiased relative rounded-[2.5rem] border-4 border-zinc-800 shadow-[0_0_6rem_rgba(107,255,155,0.15),_inset_0_0_2rem_rgba(0,0,0,0.8)] overflow-hidden">
                <CRTEffects />
                <Header />
                <main className="flex-1 flex overflow-hidden">
                    <SystemStatus />
                    <div className="flex-1 flex flex-col p-2 md:p-4 overflow-y-auto">
                    <div className="flex-1 space-y-4">
                        {messages.map((msg, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="text-xs text-amber-500/80">
                            {msg.role === MessageRole.USER && `[${msg.timestamp}] C:\\操作员 | OPERATOR>`}
                            {msg.role === MessageRole.MODEL && `[${msg.timestamp}] C.O.G.S.:\\>`}
                            {msg.role === MessageRole.SYSTEM && `[系统 | SYSTEM]`}
                            </div>
                            <pre className={`whitespace-pre-wrap text-base md:text-lg ${msg.role === MessageRole.SYSTEM ? 'text-amber-400/70' : ''}`}>
                            {msg.content}
                            </pre>
                        </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 flex-shrink-0">
                        <span className="text-green-400 text-xl">&gt;</span>
                        <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading || isBooting ? "等待响应... | AWAITING RESPONSE..." : "输入指令... | Enter directive..."}
                        disabled={isLoading || isBooting}
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-green-400 placeholder-green-700 caret-green-400 text-base md:text-lg"
                        autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isLoading || isBooting || !input.trim()}
                            className="px-4 py-1 border border-amber-600 bg-amber-900/50 text-amber-400 hover:bg-amber-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                            传输 | TRANSMIT
                        </button>
                    </form>
                    </div>
                </main>
                <style>{`
                    body {
                        text-shadow: 0 0 3px rgba(52, 211, 153, 0.4);
                    }
                    @keyframes spin-slow {
                    to {
                        transform: rotate(360deg);
                    }
                    }
                    .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                    }
                    .caret-green-400 {
                        caret-color: #4ade80;
                    }
                    @keyframes flicker {
                        0%, 100% { opacity: 0.9; }
                        50% { opacity: 1; }
                    }
                    .animate-flicker {
                        animation: flicker 0.1s step-end infinite;
                    }
                    /* Custom scrollbar for the CRT vibe */
                    .overflow-y-auto::-webkit-scrollbar {
                        width: 10px;
                    }
                    .overflow-y-auto::-webkit-scrollbar-track {
                        background: #000;
                    }
                    .overflow-y-auto::-webkit-scrollbar-thumb {
                        background-color: #15803d; /* green-700 */
                        border: 1px solid #000;
                    }
                    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                        background-color: #16a34a; /* green-600 */
                    }
                `}</style>
                </div>
            </div>
        </div>
    </div>
  );
};

export default App;
