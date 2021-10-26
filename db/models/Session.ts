import { Schema, Model, model, models } from "mongoose";

export type TermRecord<P = false> = {
    name: string;
    alias: string;
    current?: boolean;
} & (P extends true ? { _id: string } : {})

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
            name: {
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
