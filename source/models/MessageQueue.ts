import mongoose, { Document } from 'mongoose';
const schema = mongoose.Schema;

export interface MessageQueueInterface extends Document {
    username: string;
    queue: Map<string, string[] | undefined> | undefined;
}

const MessageQueueSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    queue: {
        type: Map,
        of: [String],
    },
});

const MessageQueue = mongoose.model<MessageQueueInterface>('MessageQueue', MessageQueueSchema, 'MessageQueues');
module.exports = MessageQueue;
