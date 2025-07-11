import {model, models, Schema, Types, Document, HydratedDocument} from "mongoose";
import {IGame} from "@/models/Game.model";

export const CARD_RULES = {
    profession: { unique: true },
    health:    { unique: true },
    phobia:    { unique: true },
    bio:       { unique: false },
    hobby:     { unique: true },
    additional:{ unique: true }
} as const;

export type CardType = keyof typeof CARD_RULES;

export interface ICard {
    name: string
    author: Types.ObjectId
    type: CardType
    description: string
    level: number
    image?: string
    scenarios: Types.ObjectId[]
    tags?: Types.ObjectId[][]
    isUnique: boolean
    updatedAt: string
    createdAt: string
}

export type ICardDoc = HydratedDocument<ICard>

const CardSchema = new Schema<ICard>({
    name: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: { type: String, enum: Object.keys(CARD_RULES), required: true},
    description: { type: String, required: true},
    level: { type: Number, min: 1, max: 5, default: 1},
    image: { type: String},
    scenarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Scenario',
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    isUnique: { type: Boolean, default: true }
}, {
    timestamps: true
})

const Card = models?.Card || model<ICard>("Card", CardSchema);

export default Card