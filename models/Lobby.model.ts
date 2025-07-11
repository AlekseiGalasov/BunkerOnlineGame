import {HydratedDocument, model, models, Schema, Types} from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import {IUserDoc} from "@/models/User.model";

export interface ILobby {
    name: string
    password?: string
    scenario: string
    maxPlayer: number
    creator: string
    isVisible: boolean
    status: 'closed' | 'active' | 'waiting'
    gameId?: Types.ObjectId
}

export interface ILobbyWithIds extends ILobby {
    players: Types.ObjectId[];
}

export interface ILobbyWithUsers extends ILobby {
    players: IUserDoc[];
}

export type ILobbyDocWithUsers = HydratedDocument<ILobbyWithUsers>
export type ILobbyDocWithIds = HydratedDocument<ILobbyWithIds>

export type ILobbyDoc = HydratedDocument<ILobby>

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
    status: { type: String, enum: ['closed', 'active', 'waiting'], required: true },
    gameId: {type: Types.ObjectId, ref: 'Game'}
}, {
    timestamps: true,
})

LobbySchema.virtual('isProtected').get(function () {
    return this.password ? this.password !== '' : false;
});

LobbySchema.virtual('countPlayers').get(function () {
    return this.players.length;
});

LobbySchema.plugin(mongooseLeanVirtuals)

const Lobby = models?.Lobby || model<ILobby>("Lobby", LobbySchema);

export default Lobby