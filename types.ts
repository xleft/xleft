
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}
