import Head from "next/head";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";
import { BanIcon, BellIcon, DatabaseIcon } from "@heroicons/react/outline";

import { useNotifications } from "components/Misc/Notification";
import {
  Bar,
  Grid,
  Loader,
  Modal,
  Timer,
  Question,
} from "components/Exam/Student";

import type { ClientResponse, RouteData, UserRecord } from "types";
import type {
  StudentExamGETData,
  StudentResultPOSTData,
} from "types/api/students";

type PageCookies = {
  exam?: {
    started: Date;
    examId: string;
    answers: { [questionId: string]: string };
  };
  account?: UserRecord;
};

const WriteExam: NextPage = () => {
  const [addNotification, , Notifications] = useNotifications();
  const router = useRouter();
  const [cookies, setCookies, removeCookies] = useCookies<
    "exam" | "account" | "timeBounds",
    PageCookies
  >(["exam", "account", "timeBounds"]);
  const [answered, setAnswered] = useState<{ [QuestionId: string]: string }>(
    {}
  );
  const { data: exam } = useSWRImmutable<RouteData<StudentExamGETData>>(
    router.query.id !== undefined
      ? `/api/students/${cookies.account?._id}/exams/${router.query.id}/`
      : null,
    (url) => fetch(url ?? "").then((res) => res.json())
  );

  const [started, setStarted] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const [modified, setModified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forceSubmit, setForceSubmit] = useState(false);
  const [success, setSuccess] = useState<"" | 0 | 1 | -1>("");

  useEffect(() => {
    if (modified && !firstLoad) {
      setCookies(
        "exam",
        JSON.stringify({
          ...cookies.exam,
          answers: answered,
        }),
        { path: "/" }
      );
      setModified(false);
    }
  }, [answered, cookies.exam, firstLoad, modified, setCookies]);

  useEffect(() => {
    if (Object.keys(answered).length > 0) setModified(true);
  }, [answered]);

  useEffect(() => {
    if (firstLoad && started && exam !== undefined) {
      setFirstLoad(false);

      const obj = {
        answers: {},
        started: new Date(),
        examId: exam.data._id,
      };

      if (cookies.exam?.examId === exam.data._id.toString()) {
        obj.started = cookies.exam.started;
        obj.answers = cookies.exam.answers;
      }

      setCookies("exam", JSON.stringify(obj), { path: "/" });
    }
  }, [cookies.exam, exam, firstLoad, setCookies, started]);

  useEffect(() => {
    const { answers, examId } = cookies.exam ?? { answers: {} };
    if (
      firstLoad &&
      examId === router.query.id &&
      Object.keys(answers).length > 0
    ) {
      setFirstLoad(false);
      setAnswered(answers);
    }
  }, [cookies.exam, firstLoad, router.query.id]);

  useEffect(() => {
    if (exam !== undefined && exam.data === undefined) router.push("/home");
  }, [exam, router]);

  async function handleSubmit() {
    setSuccess(-1);

    try {
      const res = await fetch(
        `/api/students/${cookies.account?._id}/cbt_results/`,
        {
          method: "POST",
          body: JSON.stringify(cookies.exam),
        }
      );
      const result =
        (await res.json()) as ClientResponse<StudentResultPOSTData>;

      if (result.success) {
        setSuccess(1);
        addNotification({
          timeout: 5e3,
          message: `Result saved 👍...  Score: ${result.data.score}`,
          Icon: () => <BellIcon className="h-6 w-6 stroke-sky-500" />,
        });
        removeCookies("exam", { path: "/" });
        removeCookies("timeBounds", { path: "/" });
        setTimeout(router.push, 1e3, "/home");
      } else throw new Error(result.error);
    } catch (error: any) {
      setSuccess(0);
      addNotification([
        {
          timeout: 5e3,
          message: "Error saving result",
          Icon: () => <BanIcon className="h-6 w-6 stroke-red-600" />,
        },
        {
          timeout: 2e3,
          message: error.message,
          Icon: () => <DatabaseIcon className="h-6 w-6 stroke-sky-500" />,
        },
      ]);
      setTimeout(setSuccess, 25e2, "");
    }
  }

  return (
    <>
      <Head>
        <title>
          {exam?.data.details.name.class}{" "}
          {exam?.data.details.name.subject ?? "Loading"} |{" "}
          {cookies.account?.name.full} | Exam | CBT | Grand Regal School
        </title>
        <meta name="description" content="Subject Exam | GRS CBT" />
        <style>{`
                    #main,
                    body { overflow: unset !important; }
                `}</style>
      </Head>
      <form className="flex min-h-screen w-screen flex-col items-center justify-start">
        <Bar
          exam={exam?.data.details.name}
          onSubmit={() => setSubmitting(true)}
        />
        <div className="flex h-full w-full grow items-center justify-center gap-6 bg-gray-50 px-12 pt-6">
          {/* <div className="flex flex-col items-start justify-start h-full w-[18rem] py-8">
                        <Grid
                            questions={exam?.data?.questions?.map(({ _id }) => ({
                                answered: !!answered[_id.toString()],
                            })) ?? []}
                        />
                    </div> */}
          <div className="h-full grow px-14 py-8">
            <div className="h-full max-w-6xl space-y-10">
              {exam?.data.questions.map((question, questionIdx) => (
                <Question
                  {...question}
                  key={questionIdx}
                  chosen={answered[question._id.toString()]}
                  onAnswer={(AnswerID) =>
                    setAnswered({
                      ...answered,
                      [question._id.toString()]: AnswerID.toString(),
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <Timer
          started={started}
          submit={() => setForceSubmit(true)}
          timeout={exam?.data.details.duration}
        />
      </form>
      <Loader
        start={() => setStarted(true)}
        exam={
          exam === undefined
            ? undefined
            : {
                ...exam.data.details.name,
                duration: exam.data.details.duration,
                questions: exam.data.questions.length,
                instructions: exam.data.details.instructions,
              }
        }
        show={exam === undefined || !started}
      />
      <Modal
        show={submitting || forceSubmit}
        success={success}
        forced={forceSubmit}
        confirm={handleSubmit}
        close={() => !forceSubmit && setSubmitting(false)}
      />
      {Notifications}
    </>
  );
};

export default WriteExam;
