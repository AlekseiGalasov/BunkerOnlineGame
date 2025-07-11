import {HydratedDocument, model, models, Schema} from "mongoose"

export interface ITag {
    name: string;
    scenarios: number
}

export type ITagDoc = HydratedDocument<ITag>

const tagSchema = new Schema<ITag>({
        name: { type: String, required: true, unique: true},
        scenarios: { type: Number, default: 0},
    },
    {
        timestamps: true
    }
)

const Tags = models?.Tag || model<ITag>("Tag", tagSchema)

export default Tags