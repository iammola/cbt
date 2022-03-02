import { EventRecord, RecordId } from "types";

export type EventsPOSTData = RecordId;
export type EventsGETData = EventRecord[];

export type EventsRangeGETData = {
  date: Date;
  time: string;
  events: string[];
}[];
