import type { Connection } from "mongoose";
import type { ServerResponse } from "types";

type PingTime = {
  time: number;
};

export type PingData = PingTime & {
  state: string;
  code: Connection["readyState"];
};

export type PingError = PingTime;
