import type { ServerResponse, StudentRecord, TeacherRecord } from "types";

export type LoginData =
  | ({ access: "Student" } & Pick<StudentRecord, "name" | "email">)
  | ({ access: "Teacher" } & Pick<TeacherRecord, "name" | "email">);
