import {HydratedDocument, model, models, Schema, Types} from "mongoose";

export interface IAccount {
    userId: Types.ObjectId;
    name: string;
    image?: string;
    password?: string;
    provider: string;
    providerAccountId: string;
}

export type IAccountDoc = HydratedDocument<IAccount>

const AccountSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true, unique: true},
    image: {type: String},
    password: {type: String},
    provider: {type: String, required: true},
    providerAccountId: {type: String, required: true},
}, {
    timestamps: true
})

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account