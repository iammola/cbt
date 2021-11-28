import { isFuture } from "date-fns";
import { Schema, Model, model, models } from "mongoose";

import type { EventRecord } from "types";

const EventSchema = new Schema<EventRecord>({
    from: {
        type: Date,
        unique: true,
        validate: [(v: Date) => isFuture(v), 'New events must be after the current date']
    }, exams: [{
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Event Exam is required'],
    }]
});

export const EventModel = models.Event as Model<EventRecord> ?? model('Event', EventSchema);
