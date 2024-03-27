import { WebSocket } from '@fastify/websocket';

export const WebsocketMessageType = {
    ERROR: Symbol('ERROR'),
    DISCORD: Symbol('DISCORD'),
    EVENT: Symbol('EVENT'),
    MESSAGE: Symbol('MESSAGE'),

    CLOSE_SERVER: Symbol('CLOSE_SERVER'),

    CONNECT_COUNT: Symbol('CONNECT_COUNT'),
};

class WebSocketContainer {
    private taskQueue: Map<string, WebSocket> = new Map<string, WebSocket>();

    public addTaskQueue(taskId: string, socket: WebSocket) {
        const queue = this.taskQueue;
        if (queue.has(taskId)) {
            // 기존 소켓이 있으면
            const oldSocket = queue.get(taskId);
            if (oldSocket) {
                oldSocket.send(
                    JSON.stringify({
                        type: 'error',
                        data: { message: 'New connection' },
                        sessionId: taskId,
                    })
                );
                oldSocket.close();
            }
        }
        this.taskQueue.set(taskId, socket);

        socket.on('message', (message, isBinary) => {
            console.log(`RECIVE :: ${taskId} ::`, message);

            if (isBinary) {
                this.onMessage(taskId, message.toString());
            } else {
                this.onMessage(taskId, message.toString());
            }
        });

        socket.on('ping', () => {
            socket.send('pong');
        });
        socket.on('close', () => {
            this.removeTaskQueue(taskId);
        });
    }

    onMessage(taskId: string, message: string) {
        console.log(`MESSAGE :: ${taskId} ::`, message);
    }

    public removeTaskQueue(taskId: string) {
        this.taskQueue.delete(taskId);
    }

    public getTaskQueueById(taskId: string): WebSocket | undefined {
        return this.taskQueue.get(taskId);
    }

    public sendMessage(taskId: string, message: string) {
        const socket = this.taskQueue.get(taskId);
        if (socket) {
            socket.send(message);
        }
    }

    public sendObject(taskId: string, message: Object) {
        this.sendMessage(
            taskId,
            JSON.stringify({
                ...message,
                task: taskId,
            })
        );
    }
    public sendError(taskId: string, message: string) {
        this.sendObject(taskId, {
            type: WebsocketMessageType.ERROR,
            task: taskId,
            data: { message },
        });
    }
    public sendEvent(taskId: string, message: string) {
        this.sendObject(taskId, {
            type: WebsocketMessageType.EVENT,
            task: taskId,
            data: { message },
        });
    }
    public sendDiscord(taskId: string, message: string) {
        this.sendObject(taskId, {
            type: WebsocketMessageType.DISCORD,
            task: taskId,
            data: { message },
        });
    }
    public send(taskId: string, message: string) {
        this.sendObject(taskId, {
            type: WebsocketMessageType.MESSAGE,
            task: taskId,
            data: { message },
        });
    }

    public broadcast(message: string) {
        this.taskQueue.forEach(socket => {
            socket.send(message);
        });
    }

    public close() {
        this.taskQueue.forEach(socket => {
            socket.send(
                JSON.stringify({
                    type: WebsocketMessageType.CLOSE_SERVER,
                    data: { message: 'Server closed' },
                })
            );
            socket.close();
        });
    }
}

export default new WebSocketContainer();
