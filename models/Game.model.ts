import {HydratedDocument, model, models, Schema, Types} from "mongoose";

export interface IGame {
    stage: 'voting' | 'discuss' | 'monolog' | 'waiting',
    totalPlayers: number,
    activePlayers: number,
    currentSpeaker: number,
    totalRounds: number,
    totalSurvivals: number,
    round: number,
    characters: Types.ObjectId[]
}

export type IGameDoc = HydratedDocument<IGame>

const GameSchema = new Schema<IGame>({
    stage: { type: String, enum: ["voting", "discuss", "monolog", "waiting"], required: true},
    totalPlayers: { type: Number, required: true},
    activePlayers: { type: Number, required: true},
    round: { type: Number, required: true, default: 1},
    totalRounds: { type: Number, required: true, default: 1},
    totalSurvivals: { type: Number, required: true, default: 1},
    currentSpeaker: { type: Number, required: true, default: 0},
    characters: [{type: Schema.Types.ObjectId, ref: 'Character', default: [], required: true}],
}, {
    timestamps: true
})

const Game = models?.Game || model<IGame>("Game", GameSchema);

export default Game