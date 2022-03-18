import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { format, formatDistance } from "date-fns";
import { FormEvent, FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  CogIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  BellIcon,
  XIcon,
  ArrowSmUpIcon,
} from "@heroicons/react/outline";

import { Bar, Modal, Question } from ".";
import { useNotifications } from "components/Misc/Notification";

import type { CreateQuestion } from "types";
import type { TeacherExamGETData } from "types/api/teachers";

const Form: FunctionComponent<{ data?: TeacherExamGETData }> = ({ data }) => {
  const router = useRouter();
  const [firstLoad, setFirstLoad] = useState(true);
  const [addNotification, , Notifications] = useNotifications();
  const [{ savedExams }, setCookies] = useCookies<"savedExams", Cookies>(["savedExams"]);

  const [exam, setExam] = useState<ExamDetails>();
  const recordTemplate = useMemo<CreateQuestion>(
    () => ({
      question: "",
      type: "Multiple choice",
      answers: [{ answer: "", isCorrect: true }, { answer: "" }],
    }),
    []
  );
  const [instructions, setInstructions] = useState(["Answer all questions", ""]);
  const [questions, setQuestions] = useState<CreateQuestion[]>([{ ...recordTemplate }]);

  const [examState, setExamState] = useState({
    details: true,
    modified: false,
    saved: false,
    uploaded: false,
    uploading: false,
  });

  useEffect(() => {
    if (data !== undefined) {
      const {
        questions,
        details: { instructions, ...details },
      } = data;
      setExam(details);
      setQuestions(questions);
      setInstructions([...instructions, ""]);
    }
  }, [data]);

  useEffect(() => {
    if (exam === undefined) return;

    if (!firstLoad) return;
    setFirstLoad(false);

    if (savedExams) {
      const saved = savedExams[exam.subjectId.toString()];

      if (saved?.exam.termId === exam.termId) {
        const decision = confirm(
          `Do you want to restore the questions saved on ${format(
            new Date(saved.lastSaved),
            "do MMM YYY"
          )} (${formatDistance(new Date(saved.lastSaved), new Date(), {
            addSuffix: true,
            includeSeconds: true,
          })}) for this subject and class?`
        );

        if (decision) {
          setExam((e) => saved.exam ?? e);
          setQuestions((q) => saved.questions ?? q);
          setInstructions((i) => saved.instructions ?? i);
        }
      }
    }
  }, [exam, firstLoad, savedExams]);

  function saveExam(obj?: { [key: string]: any }) {
    if (exam !== undefined && examState.modified) {
      setCookies(
        "savedExams",
        JSON.stringify(
          obj ?? {
            ...(savedExams ?? {}),
            [exam.subjectId.toString()]: {
              exam,
              questions,
              instructions,
              lastSaved: new Date(),
            } as SavedExam,
          }
        ),
        {
          path: "/",
          sameSite: true,
          expires: new Date("2038-01-19"),
        }
      );
      if (obj === undefined)
        addNotification({
          message: "Saved Locally",
          timeout: 3e3,
          Icon: () => <BellIcon className="h-6 w-6 stroke-blue-700" />,
        });
      setExamState({ ...examState, modified: false, saved: true });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (exam !== undefined) {
      setExamState({ ...examState, uploading: true });

      try {
        const { name, ...details } = exam;
        const [url, method] = data?._id === undefined ? ["/api/exams/", "POST"] : [`/api/exams/${data._id}/`, "PUT"];
        const res = await fetch(url, {
          method,
          body: JSON.stringify({
            questions,
            exam: {
              ...details,
              instructions: instructions.filter(Boolean),
            },
          }),
        });

        const { success, error } = await res.json();

        setExamState({ ...examState, uploaded: success });

        if (success) {
          setTimeout(router.push, 11e2, "/home");
          addNotification({
            message: "Upload Success... Redirecting",
            timeout: 1e3,
            Icon: () => <CheckCircleIcon className="h-6 w-6 stroke-emerald-700" />,
          });
          if (savedExams !== undefined)
            saveExam(
              Object.fromEntries(Object.entries(savedExams ?? {}).filter(([key]) => key !== exam.subjectId.toString()))
            );
        } else throw new Error(error);
      } catch (error: any) {
        setTimeout(saveExam, 5e2);
        addNotification({
          message: "Upload Failed... Try again",
          timeout: 5e3,
          Icon: () => <XCircleIcon className="h-6 w-6 stroke-red-700" />,
        });
        setTimeout(addNotification, 1e3, {
          message: error.message,
          timeout: 5e3,
          Icon: () => <ExclamationCircleIcon className="h-6 w-6 stroke-red-700" />,
        });
        console.error(error);
      }

      setExamState({ ...examState, uploading: false });
    }
  }

  function questionActions(pos: number, count: 1 | 0 = 0, data?: CreateQuestion) {
    const items: any[] = [...questions];
    const replace = count === 0 ? { ...recordTemplate } : data;
    items.splice(pos, count, replace);
    setQuestions(items.filter(Boolean));
    setExamState({ ...examState, saved: false, modified: true });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-screen flex-col items-center justify-start"
      >
        <Bar
          {...examState}
          save={saveExam}
          exam={exam?.name}
        />
        <section className="relative w-full grow bg-indigo-100 py-10 px-10">
          <div className="m-auto h-full max-w-3xl space-y-5">
            <div className="flex w-full flex-col gap-3 rounded-xl bg-white px-10 pt-6 pb-5 shadow-sm">
              <ul className="mt-3">
                <div className="relative mb-2 w-max text-sm text-gray-800 after:absolute after:-bottom-0 after:left-0 after:w-full after:border-b after:border-gray-500">
                  Instructions
                </div>
                {instructions.map((instruction, idx) => (
                  <li
                    key={idx}
                    className="group relative mb-2 flex items-end justify-start gap-3 text-sm"
                  >
                    <span className="-ml-4 text-xs font-semibold text-gray-500">{idx + 1}.</span>
                    <div className="relative h-full grow">
                      <input
                        type="text"
                        value={instruction}
                        placeholder="Add Instruction"
                        id={`${instruction}-${idx + 1}`}
                        className="w-full px-3 pt-1.5 pb-0.5 focus:outline-none"
                        onChange={({ target: { value } }) => {
                          const v = instructions.map((j, i) => (i === idx ? value : j)).filter(Boolean);
                          v.at(-1) !== "" && v.push("");
                          setInstructions(v);
                        }}
                      />
                      <label
                        htmlFor={`${instruction}-${idx + 1}`}
                        className="absolute left-2.5 bottom-0 w-full border-b border-dotted border-gray-400 group-focus-within:border-gray-500"
                      />
                    </div>
                    {idx > 0 && instructions.length > 2 && (
                      <span
                        onClick={() => setInstructions(instructions.filter((_, i) => i !== idx))}
                        className="ml-5 h-7 w-7 cursor-pointer rounded-full p-1.5 hover:bg-gray-100"
                      >
                        <XIcon className="h-full w-full fill-gray-500 hover:fill-gray-700" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {questions.map((question, i) => (
              <Question
                key={i}
                number={i + 1}
                record={question}
                insertQuestionAbove={() => questionActions(i)}
                insertQuestionBelow={() => questionActions(i + 1)}
                deleteQuestion={() => questions.length > 1 && questionActions(i, 1)}
                onChange={(newQuestion) => questionActions(i, 1, { ...question, ...newQuestion })}
              />
            ))}
          </div>
          <div
            onClick={() => setExamState({ ...examState, details: false })}
            className="group fixed right-4 top-24 cursor-pointer rounded-full bg-white p-2"
          >
            <CogIcon className="h-6 w-6 stroke-indigo-700" />
            <span className="absolute -left-4 -top-10 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs text-gray-600 shadow-md group-hover:inline">
              Change Settings
            </span>
          </div>
          <div
            onClick={() => scrollTo({ behavior: "smooth", top: 0 })}
            className="group fixed right-4 bottom-24 cursor-pointer rounded-full bg-white p-2"
          >
            <ArrowSmUpIcon className="h-6 w-6 stroke-indigo-700" />
            <span className="absolute -left-4 -top-10 hidden w-max -translate-x-1/2 rounded-md bg-white p-2 text-xs text-gray-600 shadow-md group-hover:inline">
              Scroll to Top
            </span>
          </div>
        </section>
        <Bar
          {...examState}
          save={saveExam}
          exam={exam?.name}
        />
      </form>
      <Modal
        onSubmit={(d) => {
          setExam(d);
          setExamState({ ...examState, details: true });
        }}
        isEdit={!!router.query.id}
        open={exam === undefined || !examState.details}
      />
      {Notifications}
    </>
  );
};

type Cookies = Partial<{ savedExams: Record<string, SavedExam> }>;

type ExamDetails = Omit<TeacherExamGETData["details"], "instructions"> & {
  termId: string;
};

type SavedExam = {
  lastSaved: Date;
  exam: ExamDetails;
  instructions: string[];
  questions: CreateQuestion[];
};

export default Form;
