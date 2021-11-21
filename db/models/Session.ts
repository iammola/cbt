import { Schema, Model, model, models } from "mongoose";

import type { SessionRecord } from "types";

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
