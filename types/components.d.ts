import type { ImageProps } from "next/image";
import type { CreateQuestion, AnswerRecord } from ".";

export type NotificationProps = {
    message: string;
    timeout: number;
    removeIcon(): void;
    Icon(props: ComponentProps<'svg'>): JSX.Element;
}

export type SelectOption = {
    _id: any;
    name: string;
}

export type SelectProps = {
    label?: string;
    className?: string;
    colorPallette?: {
        buttonBorderColor: string;
        activeOptionColor: string;
        activeCheckIconColor: string;
        buttonOffsetFocusColor: string;
        inactiveCheckIconColor: string;
    };
    selected: SelectOption;
    options?: SelectProps['selected'][];
    handleChange(T: SelectProps['selected']): void;
}

export type QuestionProps = {
    number: number;
    record: CreateQuestion;
    deleteQuestion(): void;
    insertQuestionAbove(): void;
    insertQuestionBelow(): void;
    onChange(question: Partial<CreateQuestion>): void;
}

export type AnswerProps = AnswerRecord & {
    id: string;
    number: number;
    deleteAnswer(): void;
    handleChange(answer: Partial<AnswerRecord>): void;
}

export type BrandProps = {
    open: boolean;
}

export type MenuProps = {
    open: boolean;
}

export type ThemeProps = {
    open: boolean;
}

export type ToggleProps = {
    open: boolean;
    toggleOpen(): void;
}

export type ExamModalProps = {
    onSubmit(v: {
        class: string;
        subject: string;
        details: Pick<ExamRecord, 'duration' | 'SubjectID'>;
    }): void
}

export type DivideProps = {
    className: string;
}

export type UserImageProps = ImageProps & {
    initials: {
        text: string;
        className?: string;
    }
}