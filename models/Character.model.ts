import {HydratedDocument, model, models, Schema, Types} from "mongoose";

export interface ICharacterCard {
    isOpen: boolean
    card: {
        name: string,
        type: "profession" | "health" | "phobia" | "hobby" | "luggage" | "special" | "bio" | "additional"
        level: number
        action?: string
    }
}

export interface ICharacter {
    votes: number,
    isPlaying: boolean,
    userId: Types.ObjectId
    lobbyId: Types.ObjectId
    cards: ICharacterCard[],
}

export type ICharacterDoc = HydratedDocument<ICharacter>

const CharacterSchema = new Schema<ICharacter>({
    isPlaying: { type: "Boolean", required: true, default: true},
    votes: { type: Number, required: true, default: 0},
    lobbyId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    cards: [{
        isOpen: { type: "Boolean", required: true, default: false},
        card: {
            name: {type: String, required: true},
            type: { type: String, enum: ["profession", "health", "phobia", "hobby", "luggage", "special", "bio", "additional"], required: true},
            level: {type: Number, required: true},
            action: {type: String}
        }
    }]
}, {
    timestamps: true
})

const Character = models?.Character || model<ICharacter>("Character", CharacterSchema);

export default Character