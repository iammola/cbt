export * from "./ping";
export * from "./login";
export * from "./exams";
export * from "./events";
export * from "./classes";
export * from "./sessions";
export * from "./students";
export * from "./subjects";
export * from "./teachers";

export type CodesGETData = {
  students: {
    _id: string;
    name: { full: string };
    code: number;
  }[];
};
