import type { ObjectId } from "bson";

type RecordId = { _id: ObjectId };

/* Class and Subject */

export type ClassRecord = RecordId & {
    name: string;
    alias: string;
};

export type SubjectRecord = RecordId & {
    name: string;
    alias: string;
    teachers: ObjectId[];
}

export type SubjectsRecord<P = false> = RecordId & {
    class: P extends true ? ClassRecord : ObjectId;
    subjects: SubjectRecord[];
}


/* Student and Teacher */

type UserRecord<T = never> = RecordId & {
    name: {
        title: T;
        initials: string;
        full: string;
        first: string;
        last: string;
    };
    image: string;
    email: string;
    code: string;
}

export type TeacherRecord = UserRecord<"Mr." | "Mrs." | "Ms." | "Dr." | "Master">;

export type StudentRecord = UserRecord & {
    academic: {
        session: ObjectId;
        terms: {
            term: ObjectId;
            class: ObjectId;
            subjects: ObjectId[];
        }[];
    }[];
};


/* Event and Exam and Answer */

export type EventRecord = RecordId & {
    from: Date;
    exams: ObjectId[];
};

type DateRecord<P = false> = {
    at: Date;
    by: P extends true ? TeacherRecord : ObjectId;
}

export type ExamRecord<P = false> = RecordId & {
    duration: number;
    subjectId: P extends true ? SubjectRecord : ObjectId;
    instructions: string[];
    questions: QuestionRecord[];
    created: DateRecord<P>;
    edited: DateRecord<P>[];
};

export type AnswerRecord = RecordId & {
    answer: string
    isCorrect?: boolean;
};

export type QuestionRecord = RecordId & {
    question: string;
} & ({
    type: "Multiple choice" | "Short Answer" | "Long Answer";
    answers: AnswerRecord[];
} | {
    answers: never;
    type: "Checkboxes";
    maxLength?: number;
    minLength?: number;
});


/* Session and Term */

export type SessionRecord = RecordId & {
    name: string;
    alias: string;
    current?: boolean;
    terms: TermRecord[];
};

export type TermRecord = RecordId & {
    name: string;
    alias: string;
    current?: boolean;
};
