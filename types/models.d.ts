type RecordId<P = false> = (P extends true ? { _id: string } : {});

export type AnswerRecord<P = false> = RecordId<P> & {
    answer: string
    isCorrect?: boolean;
};

export type QuestionRecord<P = false> = RecordId<P> & {
    question: string;
} & ({
    type: "Multiple choice" | "Checkboxes";
    answers: (P extends true ? AnswerRecord<P> : string)[];
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


/* Class and Subject */

export type ClassRecord<P = false> = RecordId<P> & {
    name: string;
    alias: string;
    subjects: Schema.Types.ObjectId[];
};

export type SubjectRecord<P = false> = RecordId<P> & {
    name: string;
    alias: string;
};


/* Student and Teacher */

type UserRecord<P = false, T = never> = RecordId<P> & {
    name: {
        title: T;
        initials: string;
        fullName: string;
        firstName: string;
        lastName: string;
    };
    email: string;
    code: string;
}

export type TeacherRecord<P = false> = UserRecord<P, "Mr." | "Mrs." | "Ms." | "Dr." | "Master"> & {
    subjects: Schema.Types.ObjectId[];
};

export type StudentRecord<P = false> = UserRecord<P> & {
    academic: {
        session: Schema.Types.ObjectId;
        terms: {
            term: Schema.Types.ObjectId;
            class: Schema.Types.ObjectId;
            subjects: Schema.Types.ObjectId[];
        }[];
    }[];
};


/* Student and Teacher */

export type EventRecord<P = false> = RecordId<P> & {
    date: Date;
    events: {
        name: string;
        subject: Schema.Types.ObjectId;
    }[];
};

export type ExamRecord<P = false> = RecordId<P> & {
    duration: number;
    SubjectID: P extends true ? string : Schema.Types.ObjectId;
    questions: (P extends true ? QuestionRecord<P> : string)[];
};


/* Session and Term */

export type SessionRecord<P = false> = RecordId<P> & {
    name: string;
    alias: string;
    current?: boolean;
    terms: TermRecord<P>[];
};

export type TermRecord<P = false> = RecordId<P> & {
    name: string;
    alias: string;
    current?: boolean;
};
