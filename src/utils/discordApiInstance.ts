import axios from 'axios';
import { CustomInstance } from 'interfaces/axios';
import sleep from 'utils/sleep';

const queue = [];

const discord: CustomInstance = axios.create({
    baseURL: 'https://discord.com/api/',
    headers: { authorization: `Bot ${process.env.DISCORD_TOKEN}` },
});

discord.interceptors.response.use(
    ({ data }) => data,
    async error => {
        if (error.config && error.response && error.response.status === 429) {
            console.log('Too Many Requests! Retrying...');
            const { message, retry_after } = error.response.data;
            await sleep(Math.ceil(retry_after / 1000) + 1);
            return discord(error.config);
        }
        throw error;
    }
);

export default discord;
