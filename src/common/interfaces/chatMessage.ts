export interface ChatMessageList {
    chatMessages: ChatMessage[];
}

export interface ChatMessage {
    uuid: string;
    role: string;
    content: string;
}