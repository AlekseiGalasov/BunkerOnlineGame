import {HydratedDocument, model, models, Schema, Types} from "mongoose";

export interface IScenario {
    _id: Types.ObjectId
    name: string
    author: Types.ObjectId
    description: string
    winCondition: Types.ObjectId[]
    looseCondition: Types.ObjectId[]
    isPublic: boolean
    image?: string
    updatedAt: string
    createdAt: string
}

export type IScenarioDoc = HydratedDocument<IScenario>

const ScenarioSchema = new Schema<IScenario>({
    name: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    description: { type: String, required: true},
    winCondition: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    looseCondition: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    isPublic: { type: Boolean, default: true, required: true},
    image: { type: String},
}, {
    timestamps: true
})

const Scenario = models?.Scenario || model<IScenario>("Scenario", ScenarioSchema);

export default Scenario