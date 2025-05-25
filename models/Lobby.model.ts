import {model, models, Schema } from "mongoose";

export interface ILobby {
    name: string
    password?: string
    scenario: string
    maxPlayer: number
    players: string[]
    creator: string
    isVisible: boolean
    status: 'closed' | 'active' | 'waiting'
}

export interface ILobbyDoc extends ILobby, Document {}

const LobbySchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String},
    scenario: { type: String, required: true},
    maxPlayer: { type: Number, default: 8, max: 12, min: 6},
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    creator: { type: Schema.Types.ObjectId, ref: 'User'},
    isVisible: { type: Boolean, required: true},
    status: { type: String, enum: ['closed', 'active', 'waiting'], required: true }
}, {
    timestamps: true
})

const Lobby = models?.Lobby || model<ILobby>("Lobby", LobbySchema);

export default Lobby