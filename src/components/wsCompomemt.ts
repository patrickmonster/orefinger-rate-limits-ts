import { Message, SendMessage } from 'interface/message';
import { join } from 'path';
import autoLoader, { getCommand } from 'utils/autoCommand';

const [commands] = autoLoader(join(__dirname, 'commands'), { pathTag: ' ', isLog: true });

const messageComponent = getCommand<SendMessage, any>(commands);

// 웹 소캣을 처리합니다.
export default (ws: WebSocket, message: string) => {
    const { type, data, sessionId } = JSON.parse(message) as Message<any>;

    const command = messageComponent.find(module => type.startsWith(module[0]));
    if (command) {
        const [, exec] = command;
        exec((type, data) => {
            ws?.send(
                JSON.stringify({
                    type,
                    data,
                    sessionId,
                })
            );
        }, data);
    } else {
        ws.send(
            JSON.stringify({
                type: 'error',
                data: {
                    message: 'Unknown command',
                },
                sessionId,
            })
        );
    }
};
