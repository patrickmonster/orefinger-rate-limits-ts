enum MessageType {
    CONNECT = 'CONNECT',
    DISCONNECT = 'DISCONNECT',
    MESSAGE = 'MESSAGE',
    ERROR = 'ERROR',
    PING = 'PING',
    PONG = 'PONG',
}

export interface MessageHeader {
    type: MessageType;
    sessionId: string;
}

export interface Message<T> extends MessageHeader, MessageData<T> {}

export interface MessageData<T> {
    data: T;
}

export type SendMessage = <T>(type: MessageType, data: MessageData<T>) => void;
