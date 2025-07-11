import {model, models, Schema, HydratedDocument} from "mongoose";

export interface IUser {
    username: string
    email: string
    image: string
    totalGames?: number
    totalWins?: number
}

export type IUserDoc = HydratedDocument<IUser>

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    image: { type: String},
    totalGames: { type: Number, default: 0},
    totalWins: { type: Number, default: 0},
}, {
    timestamps: true
})

const User = models?.User || model<IUser>("User", UserSchema);

export default User