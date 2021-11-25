import type { ServerResponse, StudentRecord, TeacherRecord } from "types";

export type LoginData = (TeacherRecord | StudentRecord) & {
    access: "Teacher" | "Student"
};
