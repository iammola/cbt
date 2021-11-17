import type { Schema } from "mongoose";

type RecordId<P = false, I = false> = (P extends true ? { _id: I extends true ? Schema.Types.ObjectId : string } : {});

/* Class and Subject */

export type ClassRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
};

export type SubjectRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
    teachers: Schema.Types.ObjectId[];
}

export type SubjectsRecord<P = false, I = false> = RecordId<P, I> & {
    class: Schema.Types.ObjectId;
    subjects: SubjectRecord<true, I>[];
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


/* Event and Exam and Answer */

export type EventRecord<P = false, I = false> = RecordId<P, I> & {
    date: Date;
    events: {
        name: string;
        subject: Schema.Types.ObjectId;
    }[];
};

type DateRecord<P, I> = {
    at: Date;
    by: P extends true ? TeacherRecord<P, I> : Schema.Types.ObjectId;
}

export type ExamRecord<P = false, I = false> = RecordId<P, I> & {
    duration: number;
    subjectId: P extends true ? SubjectRecord<P, I> : Schema.Types.ObjectId;
    instructions: string[];
    questions: QuestionRecord<true, I>[];
    created: DateRecord<P, I>;
    edited: DateRecord<P, I>[];
};

export type AnswerRecord<P = false, I = false> = RecordId<P, I> & {
    answer: string
    isCorrect?: boolean;
};

export type QuestionRecord<P = false, I = false> = RecordId<P, I> & {
    question: string;
} & ({
    type: "Multiple choice" | "Short Answer" | "Long Answer";
    answers: AnswerRecord<true, I>[];
} | {
    answers: never;
    type: "Checkboxes";
    maxLength?: number;
    minLength?: number;
});


/* Session and Term */

export type SessionRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
    current?: boolean;
    terms: TermRecord<true, I>[];
};

export type TermRecord<P = false, I = false> = RecordId<P, I> & {
    name: string;
    alias: string;
    current?: boolean;
};
