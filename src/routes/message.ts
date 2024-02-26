import { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance, opts: any) => {
    //

    fastify.get('/ws', { websocket: true }, async (connection, request) => {
        // @algorithm.ts/circular-queue
        connection.socket.on('message', (message: string) => {
            connection.socket.send('pong');
        });
    });
};
