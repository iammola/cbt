import { ClassRecord, ExamRecord, RecordId, SubjectRecord, UserRecord } from "types";

export type TeachersPOSTData = Pick<UserRecord, 'code'>;

export type TeacherClassGETData = ClassRecord[];

export type TeacherClassSubjectGETData = {
    subjects: Omit<SubjectRecord, 'teachers'>[];
}

export type TeacherExamGETData = (Omit<ExamRecord<true>, 'subjectId' | 'questions'> & {
    class: string;
    subject: string;
    questions: number;
})[];

export type TeacherSubjectsGETData = RecordId['_id'][];

export type TeacherSubjectsExtendGETData = {
    name: string;
    subjects: Omit<SubjectRecord, 'teachers'>[];
}[];
