'use strict';
import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async function (fastify, opts) {
    fastify.register(websocket, {
        options: {
            maxPayload: 1048576,
            verifyClient: function (info: any, next: any) {
                fastify.jwt.verify(info.req.headers.authorization, (err: Error | null, decoded: any) => {
                    if (err) {
                        next(false);
                        return;
                    }
                    info.req.user = decoded;
                    next(true);
                });
            },
        },
    });
});
