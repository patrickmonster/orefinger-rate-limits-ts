import { getTask } from 'controllers/ecs';
import { FastifyInstance } from 'fastify';
import { WebSocketContainer } from 'utils/ws';

export default async (fastify: FastifyInstance, opts: any) => {
    //
    const container = new WebSocketContainer();

    fastify.get<{
        Params: { taskId: string };
    }>('/ws/:taskId', { websocket: true }, async (socket, request) => {
        const { taskId } = request.params;

        console.log(`NEW CONNECTION: ${taskId}`);
        const target = await getTask(taskId);

        if (!target) {
            socket.send(
                JSON.stringify({
                    type: 'error',
                    data: { message: 'Task not found' },
                    sessionId: taskId,
                })
            );
            socket.close();
            return;
        }

        container.addTaskQueue(taskId, socket);
    });
};
