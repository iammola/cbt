import type { ClassRecord, ClassResultTemplate, RecordId, ServerResponse, SubjectRecord, SubjectsRecord } from "types";

export type ClassesGETData = ClassRecord[];
export type ClassesPOSTData = ClassRecord;

export type ClassSubjectPOSTData = Omit<SubjectRecord, '_id' | 'teachers'>;
export type ClassSubjectGETData = Omit<SubjectsRecord, '_id' | 'class'> | null;

export type ClassExamGETData = {
    exams: (RecordId & {
        name: string;
        alias?: string;
    })[]
};

export type ClassResultSettingsPOSTData = {
    ok: boolean;
}

export type ClassResultSettingsGETData = ClassResultTemplate | undefined
