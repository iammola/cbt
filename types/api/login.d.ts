import type { ServerResponse, StudentRecord, TeacherRecord } from "types";

export type LoginData = Pick<StudentRecord | TeacherRecord, "name" | "email"> & {
  access: "Teacher" | "Student";
};
