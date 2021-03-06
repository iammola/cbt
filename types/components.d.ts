import type { ImageProps } from "next/image";
import type { TeacherExamGETData } from "types/api";
import type { CreateQuestion, AnswerRecord, ExamRecord, QuestionRecord } from ".";

export type NotificationProps = {
  message: string;
  timeout: number;
  remove(): void;
  out?: boolean;
  Icon(props: React.ComponentProps<"svg">): JSX.Element;
};

export type SelectOption = {
  _id: any;
  name: string;
};

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
  options?: SelectProps["selected"][];
  handleChange(T: SelectProps["selected"]): void;
};

export type TeacherQuestionProps = {
  number: number;
  record: CreateQuestion;
  deleteQuestion(): void;
  insertQuestionAbove(): void;
  insertQuestionBelow(): void;
  onChange(question: Partial<CreateQuestion>): void;
};

export type TeacherAnswerProps = Omit<AnswerRecord, "_id"> & {
  id: string;
  number: number;
  deleteAnswer(): void;
  handleChange(answer: Partial<Omit<AnswerRecord, "_id">>): void;
};

export type BrandProps = {
  open: boolean;
};

export type MenuProps = {
  open: boolean;
};

export type ThemeProps = {
  open: boolean;
};

export type ToggleProps = {
  open: boolean;
  toggleOpen(): void;
};

export type TeacherExamModalProps = {
  open: boolean;
  isEdit: boolean;
  createdBy: string;
  onSubmit(v: Omit<TeacherExamGETData["details"], "instructions">): void;
};

export type DivideProps = {
  className: string;
  HRclassName?: string;
};

export type UserImageProps = ImageProps & {
  initials: {
    text: string;
    className?: string;
  };
};

export type TeacherBarProps = {
  save(): void;
  saved: boolean;
  modified: boolean;
  uploaded: boolean;
  uploading: boolean;
  exam?: TeacherExamGETData["details"]["name"];
};

export type StudentQuestionProps = QuestionRecord & {
  chosen?: string;
  onAnswer(AnswerID: QuestionRecord["_id"]): void;
};

export type StudentAnswerProps = Omit<AnswerRecord, "isCorrect"> & {
  selected: boolean;
  handleSelect(id: AnswerRecord["_id"]): void;
};

export type StudentTimerProps = {
  submit(): void;
  timeout?: number;
  started: boolean;
};

export type StudentGridProps = {
  questions: {
    active?: boolean;
    answered: boolean;
  }[];
};

export type StudentBarProps = {
  onSubmit(): void;
  exam?: Omit<TeacherExamGETData["details"]["name"], "createdBy">;
};

export type StudentLoaderProps = {
  show: boolean;
  start(): void;
  exam?: Pick<ExamRecord, "instructions" | "duration"> & {
    class: string;
    subject: string;
    questions: number;
  };
};

export type StudentModalProps = {
  show: boolean;
  close(): void;
  forced: boolean;
  confirm(): void;
  /**
   * - '' = Idle
   * - 0 = Failed
   * - 1 = Success
   * - -1 = Loading
   */
  success: "" | 0 | 1 | -1;
};
