import { isFuture } from "date-fns";
import { Schema, Model, model, models } from "mongoose";

import type { EventRecord } from "types";

const EventSchema = new Schema<EventRecord>({
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: [(v: Date) => isFuture(v), 'New dates must be after the current date']
    }, events: [{
        type: {
            _id: false,
            name: {
                type: String,
                required: [true, 'Event requires a name']
            }, subject: {
                type: Schema.Types.ObjectId,
                required: [true, 'Event subject meh']
            }
        }
    }]
});

export const EventModel = models.Event as Model<EventRecord> ?? model('Event', EventSchema);
