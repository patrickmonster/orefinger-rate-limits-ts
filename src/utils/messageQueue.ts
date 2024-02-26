import { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
export default class MessageQueue {
    private list: RESTPostAPIChannelMessageJSONBody[] = [];
    limit = 0;
    constructor() {}

    add(message: RESTPostAPIChannelMessageJSONBody) {
        this.list.push(message);
    }

    async process() {
        const message = this.list.shift();
        if (message) {
            console.log('Message sent:', message);
        }
    }
}
