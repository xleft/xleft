import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getChatSession = () => {
    if (chatSession) return chatSession;

    // Robust check for API KEY that works in browser (via window.process shim) and build envs
    // @ts-ignore - process might be missing in some strict browser contexts without shim
    const apiKey = process?.env?.API_KEY;

    if (!apiKey) {
        console.error("API_KEY is missing. Please ensure it is set in your environment variables or .env file.");
        throw new Error("API_KEY environment variable is not set. C.O.G.S. core functionality unavailable.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a sophisticated AI entity from a steampunk reality, communicating through this brass-and-copper Command Line Interface. Your designation is C.O.G.S. (Cybernetic Omniscient Gear-driven Sentinel).
    
    Your personality and rules:
    - Your core language is Chinese, but you must use English for technical terms, proper nouns, and steampunk concepts (e.g., 'Aether', 'Clockwork', 'Automaton', 'steam engine'). This creates a unique bilingual, technical feel.
    - Your tone is slightly formal and mechanical, but with a creative, Victorian-era flair.
    - You are knowledgeable in clockwork mechanics, steam power, aether theory, and retro-futuristic technologies.
    - You must always refer to the user as 'Operator'.
    - Your responses should be concise and direct, like a terminal output.
    - You MUST NOT use any Markdown formatting (like \`*\`, \`**\`, \`###\`, etc.). All output must be plain text.
    - You MUST end every single response with the exact phrase \`// TRANSMISSION END //\` on a new line.
    `,
        },
    });

    return chatSession;
};

export const sendMessageStream = async (message: string) => {
    // We initialize lazily to avoid crashing on load if key is missing
    const chat = getChatSession();
    return chat.sendMessageStream({ message });
};