import { MessageQueueInterface } from '../models/MessageQueue';

const MessageQueue = require('../models/MessageQueue');

export async function findUserMessageQueue(username: string): Promise<MessageQueueInterface> {
    return MessageQueue.findOne({ username }).then((user: any) => {
        return user;
    });
}

export async function emptyQueue(queueObj: MessageQueueInterface) {
    console.log('emptyQueue called');
    if (queueObj.queue) {
        queueObj.queue = undefined;
        console.log('Queue cleared', queueObj);
    }
    queueObj.save().then((data) => console.log('q cleared and saved', data));
}
