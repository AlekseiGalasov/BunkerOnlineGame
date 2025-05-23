import {Document, model, models, Schema} from "mongoose"

export interface ITag {
    name: string;
}

export interface ITagDoc extends ITag, Document {}

const tagSchema = new Schema<ITag>({
        name: { type: String, required: true, unique: true},
    },
    {
        timestamps: true
    }
)

const Tags = models?.Tag || model<ITag>("Tag", tagSchema)

export default Tags