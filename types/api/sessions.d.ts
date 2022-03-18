import { RecordId, SessionRecord } from "types";

export type SessionsGETData = SessionRecord[];
export type SessionsPOSTData = SessionRecord;

export type SessionCurrentGETData = SessionRecord | null;

export type TermGETData = RecordId;

export type AllTermsGetData = (RecordId & {
  name: string;
  current?: boolean;
})[];
