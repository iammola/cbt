import type { Schema } from "mongoose";

type RecordId<P = false, I = false> = (P extends true ? { _id: I extends true ? Schema.Types.ObjectId : string } : {});

/* Class and Subject */

export type ClassRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
};

export type SubjectRecord<P = false, I = false> = RecordId<P, I> & {
    class: Schema.Types.ObjectId;
    subjects: (RecordId<P, I> & {
        name: string;
        alias: string;
        teachers: Schema.Types.ObjectId[];
    })[];
}


/* Student and Teacher */

type UserRecord<P = false, I = false, T = never> = RecordId<P, I> & {
    name: {
        title: T;
        initials: string;
        fullName: string;
        firstName: string;
        lastName: string;
    };
    image: string;
    email: string;
    code: string;
}

export type TeacherRecord<P = false, I = false> = UserRecord<P, I, "Mr." | "Mrs." | "Ms." | "Dr." | "Master">;

export type StudentRecord<P = false, I = false> = UserRecord<P, I> & {
    academic: {
        session: Schema.Types.ObjectId;
        terms: {
            term: Schema.Types.ObjectId;
            class: Schema.Types.ObjectId;
            subjects: Schema.Types.ObjectId[];
        }[];
    }[];
};


/* Event and Exam */

export type EventRecord<P = false, I = false> = RecordId<P, I> & {
    date: Date;
    events: {
        name: string;
        subject: Schema.Types.ObjectId;
    }[];
};

export type ExamRecord<P = false, I = false> = RecordId<P, I> & {
    duration: number;
    SubjectID: P extends true ? SubjectRecord<P, I> : Schema.Types.ObjectId;
    questions: (P extends true ? QuestionRecord<P, I> : Schema.Types.ObjectId)[];
    instructions: string[];
    created: {
        at: Date;
        by: P extends true ? TeacherRecord<P, I> : Schema.Types.ObjectId;
    };
};

export type AnswerRecord<P = false, I = false> = RecordId<P, I> & {
    answer: string
    isCorrect?: boolean;
};

export type QuestionRecord<P = false, I = false> = RecordId<P, I> & {
    question: string;
} & ({
    type: "Multiple choice" | "Checkboxes";
    answers: (P extends true ? AnswerRecord<P, I> : Schema.Types.ObjectId)[];
    maxLength: undefined;
    minLength: undefined;
} | {
    type: "Short Answer" | "Long Answer";
    answers: undefined;
    maxLength: number;
    minLength: number;
}) & ({
    type: "Checkboxes";
    max: number;
    min: number;
} | {
    type: "Short Answer" | "Long Answer" | "Multiple choice";
    max: undefined;
    min: undefined;
});


/* Session and Term */

export type SessionRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
    current?: boolean;
    terms: TermRecord<P, I>[];
};

export type TermRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
    current?: boolean;
};
