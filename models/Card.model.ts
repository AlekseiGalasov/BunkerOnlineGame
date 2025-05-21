import {model, models, Schema } from "mongoose";

export interface ICard {
    name: string
    type: "profession" | "health" | "phobia" | "hobby" | "luggage" | "special"
    description: string
    tags: string[]
}

export interface ICardDoc extends ICard, Document {}

const CardSchema = new Schema({
    name: { type: String, required: true},
    type: { type: String, enum: ["profession", "health", "phobia", "hobby", "luggage", "special"], required: true},
    description: { type: String, required: true},
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }]
}, {
    timestamps: true
})

const Card = models?.Card || model<ICard>("Card", CardSchema);

export default Card