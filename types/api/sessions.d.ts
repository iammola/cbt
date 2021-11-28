import { RecordId, SessionRecord } from "types";

export type SessionsGETData = SessionRecord[];
export type SessionsPOSTData = SessionRecord;

export type SessionCurrentGETData = SessionRecord | null;
