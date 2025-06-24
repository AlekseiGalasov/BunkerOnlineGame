import {model, models, Schema } from "mongoose";

export interface ICard {
    _id: string
    name: string
    type: "profession" | "health" | "phobia" | "hobby" | "luggage" | "special" | "bio"
    description: string
    level: number
    image?: string
    tags?: string[]
    updatedAt: string
    createdAt: string
}

export interface ICardDoc extends ICard, Document {}

const CardSchema = new Schema({
    name: { type: String, required: true},
    type: { type: String, enum: ["profession", "health", "phobia", "hobby", "luggage", "special", "bio"], required: true},
    description: { type: String, required: true},
    level: { type: Number, min: 1, max: 5, default: 1},
    image: { type: String},
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }]
}, {
    timestamps: true
})

const Card = models?.Card || model<ICard>("Card", CardSchema);

export default Card