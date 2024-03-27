import { query } from 'utils/database';

export const getTask = async (taskId: string) =>
    query<{
        idx: number;
        id: string;
        revision: number;
        family: string;
        last_ping: string;
        create_at: string;
    }>(
        `
SELECT 
    idx
    , id
    , revision
    , family
    , last_ping
    , create_at  
FROM task t 
WHERE id = ?
        `,
        taskId
    ).then(result => result[0]);
