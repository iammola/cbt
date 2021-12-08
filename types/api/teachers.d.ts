import { CBTResultRecord, ClassRecord, ExamRecord, RecordId, SubjectRecord, UserRecord } from "types";

export type TeachersPOSTData = Pick<UserRecord, 'code'>;

export type TeacherClassGETData = ClassRecord[];

export type TeacherClassSubjectGETData = {
    subjects: Omit<SubjectRecord, 'teachers'>[];
}

export type TeacherExamsGETData = (Pick<ExamRecord<true>, 'created'> & Omit<ExamRecord, 'created' | 'subjectId' | 'questions'> & {
    class: string;
    subject: string;
    questions: number;
})[];

export type TeacherExamGETData = RecordId & {
    questions: QuestionRecord[];
    details: Pick<ExamRecord, 'duration' | 'instructions' | 'subjectId'> & {
        name: {
            class: string;
            subject: string;
        };
    };
}

export type TeacherSubjectsGETData = RecordId['_id'][];

export type TeacherSubjectsExtendGETData = {
    name: string;
    subjects: Omit<SubjectRecord, 'teachers'>[];
}[];

export type TeacherCBTResultsGETData = Pick<CBTResultRecord<true>, 'student' | 'results'>[]
