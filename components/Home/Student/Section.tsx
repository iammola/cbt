import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/solid";
import { format, isFuture } from "date-fns";
import { useEffect, useState } from "react";

export const Section: React.FC<CP> = ({ children }) => {
  return <section className="w-full space-y-5">{children}</section>;
};

export const Title: React.FC<CP> = ({ children }) => {
  return <h4 className="font-serif text-4xl font-bold tracking-wide text-gray-700">{children}</h4>;
};

export const Cards: React.FC<CP> = ({ children }) => {
  return <ul className="relative flex w-full flex-wrap items-center justify-start gap-x-10 gap-y-6">{children}</ul>;
};

export const ExamCard: React.FC<ExamCardProps> = ({ _id, className, date, duration, subject, questions }) => {
  const dateTime = date.getTime();
  const [isLocked, setIsLocked] = useState(isFuture(date));

  useEffect(() => {
    const diff = dateTime - Date.now();
    if (diff <= 0) return;

    const timer = setTimeout(() => setIsLocked(false), diff);
    return () => clearTimeout(timer);
  }, [dateTime]);

  return (
    <li className={className}>
      <h5 className="text-2xl font-bold text-gray-700 line-clamp-2">{subject}</h5>
      <ul className="w-full list-inside list-disc space-y-1">
        {[[questions, "questions"], [duration, "minutes"], [format(date, "EEEE, dd MMM yyyy")]].map(([val, key]) => (
          <li
            key={key ?? "date"}
            className="text-sm text-slate-700"
          >
            <span className="font-medium">{val}</span> {key}
          </li>
        ))}
      </ul>
      {isLocked ? (
        <button
          type="button"
          className="flex w-full cursor-pointer select-none items-center justify-center gap-x-1 rounded-full bg-gray-500 py-2 px-8 text-sm font-medium tracking-wide text-white"
        >
          <LockClosedIcon className="h-5 w-5 fill-white" />
          Locked
        </button>
      ) : (
        <Link href={`/exams/write/${_id}`}>
          <a className="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-blue-500 py-2 px-8 text-sm font-medium tracking-wide text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
            Start Exam
          </a>
        </Link>
      )}
    </li>
  );
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ attempts, className, date, time, score, subject }) => {
  return (
    <li className={className}>
      <h5 className="text-4xl font-bold tracking-wide text-gray-700">{score}</h5>
      <h6 className="text-lg font-medium text-gray-600 line-clamp-2">{subject}</h6>
      <ul className="w-full list-inside list-disc space-y-1">
        {[
          ["Spent", time, time != 1 ? "minutes" : "minute"],
          ["Attempted", attempts, attempts != 1 ? "questions" : "question"],
          ["Date:", format(date, "EEEE, dd MMM yyyy")],
        ].map(([k, v, l], idx) => (
          <li
            key={idx}
            className="text-sm text-slate-500"
          >
            {k} <span className="font-medium text-slate-700">{v}</span> {l}
          </li>
        ))}
      </ul>
    </li>
  );
};

type ExamCardProps = {
  _id: unknown;
  className: string;
  subject: string;
  questions: number;
  duration: number;
  date: Date;
};

type ScoreCardProps = {
  score: number;
  subject: string;
  time: number;
  date: Date;
  className: string;
  attempts: number;
};
