
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id: number;
  role: MessageRole;
  content: string;
  timestamp: string;
}