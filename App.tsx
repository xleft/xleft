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
  <header className="text-center text-amber-400 font-mono relative overflow-hidden flex-shrink-0 flex flex-col w-full border-b-2 border-amber-900/40 mb-4">
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

  // Get the content of the last message to trigger scrolling on character updates
  const lastMessageContent = messages.length > 0 ? messages[messages.length - 1].content : null;
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length, lastMessageContent]);

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
      let fullText = '';
      const modelMessageId = nextId.current++;
      const modelMessage: ChatMessage = {
          id: modelMessageId,
          role: MessageRole.MODEL,
          content: '▋',
          timestamp: new Date().toLocaleTimeString(),
        };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        // Simulate typewriter effect by splitting chunk into characters
        for (const char of chunkText) {
            fullText += char;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, content: fullText + '▋' } : msg
            ));
            // Small delay to simulate baud rate (faster than boot, but still retro)
            // 10ms is fast but perceptible
            await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      setMessages(prev => prev.map(msg =>
        msg.id === modelMessageId ? { ...msg, content: fullText } : msg
      ));

    } catch (error) {
      console.error("Gemini API error:", error);
      let errorMsg = "传输错误: 未能获取响应 | TRANSMISSION ERROR: Could not get a response.";
      if (error instanceof Error && error.message.includes("API_KEY")) {
          errorMsg = "认证失败: 缺少 API 密钥 | AUTH ERROR: API KEY MISSING. CHECK DEPLOYMENT CONFIG.";
      }

      const errorMessage: ChatMessage = {
        id: nextId.current++,
        role: MessageRole.SYSTEM,
        content: errorMsg,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button style based on input state
  const hasInput = input.trim().length > 0;
  // Ink Green (Emerald-700/800 range) for darker look
  const buttonClass = hasInput
    ? "w-full mt-2 p-2 text-xl font-bold rounded-sm bg-emerald-700 text-black border-2 border-emerald-700 cursor-pointer transition-colors shadow-[0_0_10px_rgba(4,120,87,0.4)] hover:bg-emerald-600"
    : "w-full mt-2 p-2 text-xl font-bold bg-transparent text-emerald-900 rounded-sm border-2 border-emerald-900 cursor-not-allowed transition-colors opacity-50";

  return (
    <div className="w-full h-screen bg-zinc-900 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Outer Bezel */}
        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-[3rem] shadow-2xl shadow-black border-t-2 border-zinc-700">
            {/* Inner Bezel / Shadow */}
            <div className="bg-black p-1 sm:p-2 rounded-[2.5rem]">
                {/* The Screen element */}
                <div className="w-[94vw] h-[88vh] max-w-[1600px] bg-black text-amber-400 font-mono flex flex-col antialiased relative rounded-[2.2rem] border-4 border-zinc-800 shadow-[0_0_6rem_rgba(251,191,36,0.15),_inset_0_0_2rem_rgba(0,0,0,0.8)] overflow-hidden">
                <CRTEffects />
                
                <main className="flex-1 flex flex-col overflow-y-auto pb-2">
                    {/* Header moved inside main to scroll with content */}
                    <Header />
                    <div className="flex-1 space-y-4 p-2 md:p-4">
                        {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.role === MessageRole.USER && (
                                <pre className="whitespace-pre-wrap text-lg md:text-xl text-emerald-600 drop-shadow-[0_0_2px_rgba(5,150,105,0.5)]">
                                    <span className="text-emerald-800">OPERATOR:/~> </span>{msg.content}
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
                    <footer className="p-2 md:p-4 flex-shrink-0 bg-black relative z-40">
                        <form onSubmit={handleSubmit}>
                            {/* Input Container: Ink Green (Emerald-800) Border, changed from 700 */}
                            <div className={`flex items-center gap-2 border-2 ${hasInput ? 'border-emerald-700 shadow-[0_0_5px_rgba(4,120,87,0.3)]' : 'border-emerald-900'} p-2 bg-black/80 rounded-sm transition-all duration-300`}>
                                <label htmlFor="userInput" className="text-emerald-800 text-lg md:text-xl whitespace-nowrap">OPERATOR:/~> </label>
                                <input
                                id="userInput"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isLoading ? "等待响应..." : "Enter directive..."}
                                disabled={isLoading}
                                // Input Text: Ink Green (Emerald-600) to match request
                                className="flex-1 bg-transparent border-0 focus:ring-0 text-emerald-600 placeholder-emerald-900/50 caret-emerald-500 text-lg md:text-xl"
                                autoFocus
                                />
                            </div>
                             <button
                                type="submit"
                                disabled={isLoading || !hasInput}
                                className={buttonClass}
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