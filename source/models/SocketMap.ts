import mongoose, { Document } from 'mongoose';

export interface SocketMapInterface extends Document {
    socketToUsername: Map<string, string>;
    usernameToSocket: Map<string, string>;
}

const SocketMapScheme = new mongoose.Schema({
    socketToUsername: {
        type: Map,
        of: String,
    },
    usernameToSocket: {
        type: Map,
        of: String,
    },
});

const SocketMap = mongoose.model<SocketMapInterface>('SocketMap', SocketMapScheme);
module.exports = SocketMap;
