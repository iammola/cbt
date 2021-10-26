import { Schema, Model, model, models } from "mongoose";

export type TermRecord<P = false> = {
    _id: P extends true ? Schema.Types.ObjectId : string;
    name: string;
    alias: string;
    current?: boolean;
}

export type SessionRecord<P = false> = {
    name: string;
    alias: string;
    current?: boolean;
    terms: TermRecord<P>[];
} & (P extends true ? { _id: string } : {})

const SessionSchema = new Schema<SessionRecord>({
    name: {
        type: String,
        required: [true, 'Session name is required'],
        unique: true,
        trim: true,
    }, alias: {
        type: String,
        required: [true, 'Session alias is required'],
        unique: true,
        trim: true,
    }, current: {
        type: Boolean,
        default: undefined
    }, terms: [{
        type: {
            _id: {
                type: Schema.Types.ObjectId
            }, name: {
                type: String,
                trim: true,
            }, alias: {
                type: String,
                trim: true,
            }, current: {
                type: Boolean,
                default: undefined
            }
        },
    }],
});

export const SessionModel = models.Session as Model<SessionRecord> ?? model('Session', SessionSchema);
