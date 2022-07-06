import type { ServerResponse, StudentRecord, TeacherRecord } from "types";

export type LoginData = {
  access: "Student" | "Teacher" | "GroupedUser";
  email: string;
  name: {
    full: string;
    initials: string;
    title?: string;
    first?: string;
    last?: string;
  };
};
