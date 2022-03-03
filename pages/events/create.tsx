import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { addHours, format } from "date-fns";
import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";
import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";

import type { ClassesGETData, ClassExamGETData } from "types/api/classes";
import type {
  ClientResponse,
  RouteData,
  RouteError,
  SelectOption,
} from "types";
import { EventsGETData } from "types/api/events";

const CreateEvent: NextPage = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Loading classes...",
  });
  const [selectedExam, setSelectedExam] = useState({
    _id: "",
    name: "Select exam",
  });

  const [exams, setExams] = useState<SelectOption[]>();
  const { data: classes, error } = useSWR<
    RouteData<ClassesGETData>,
    RouteError
  >("/api/classes/?select=name", (url) => fetch(url).then((res) => res.json()));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();

  useEffect(() => {
    setSelectedClass({
      _id: "",
      name:
        error !== undefined && classes === undefined
          ? "Error Loading Classes"
          : classes === undefined
          ? "Loading classes..."
          : "Select class",
    });
  }, [classes, error]);

  useEffect(() => {
    const { _id } = selectedClass;

    async function getExams() {
      setSelectedExam({ _id: "", name: "Loading exams..." });
      try {
        const res = await fetch(`/api/classes/${_id}/exams`);
        const result = (await res.json()) as ClientResponse<ClassExamGETData>;

        if (result.success) {
          setExams(result.data.exams);
          setSelectedExam({ _id: "", name: "Select exam" });
        } else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }
    }

    if (_id !== "") getExams();
  }, [selectedClass]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedClass._id !== "" && selectedExam._id !== "") {
      setLoading(true);

      try {
        const res = await fetch("/api/events/", {
          method: "POST",
          body: JSON.stringify({
            date,
            examId: selectedExam._id,
          }),
        });

        const result = (await res.json()) as ClientResponse<EventsGETData>;

        setSuccess(result.success);

        if (result.success) {
          setDate(null);
          setSelectedClass({ _id: "", name: "Select class" });
          setSelectedExam({ _id: "", name: "Select exam" });
        } else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }

      setLoading(false);
      setTimeout(setSuccess, 15e2, undefined);
    }
  }

  return (
    <>
      <Head>
        <title>Create Event | CBT | Grand Regal School</title>
        <meta name="description" content="Event Registration | GRS CBT" />
      </Head>
      <section className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-500 p-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-lg"
        >
          <h1 className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
            <span>Create an</span>{" "}
            <span className="text-violet-500">Event</span>
          </h1>
          <Select
            label="Classes"
            colorPallette={{
              activeCheckIconColor: "stroke-violet-600",
              inactiveCheckIconColor: "stroke-violet-800",
              activeOptionColor: "text-violet-900 bg-violet-100",
              buttonBorderColor: "focus-visible:border-purple-500",
              buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500",
            }}
            options={classes?.data}
            selected={selectedClass}
            handleChange={setSelectedClass}
          />
          <Select
            label="Exams"
            colorPallette={{
              activeCheckIconColor: "stroke-violet-600",
              inactiveCheckIconColor: "stroke-violet-800",
              activeOptionColor: "text-violet-900 bg-violet-100",
              buttonBorderColor: "focus-visible:border-purple-500",
              buttonOffsetFocusColor: "focus-visible:ring-offset-purple-500",
            }}
            options={exams}
            selected={selectedExam}
            handleChange={setSelectedExam}
          />
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="date"
              className="text-sm font-semibold text-gray-600"
            >
              Event Date
            </label>
            <input
              required
              id="date"
              type="datetime-local"
              onChange={(e) => setDate(new Date(e.target.value))}
              min={format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")}
              value={date === null ? "" : format(date, "yyyy-MM-dd'T'HH:mm")}
              className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <button
            type="submit"
            className={classNames(
              "mt-3 flex items-center justify-center gap-4 rounded-md py-2.5 px-3 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white",
              {
                "bg-violet-400 hover:bg-violet-500 focus:ring-violet-500":
                  success === undefined,
                "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500":
                  success,
                "bg-red-400 hover:bg-red-500 focus:ring-red-500":
                  success === false,
              }
            )}
          >
            {loading && (
              <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />
            )}
            {success && <CheckIcon className="h-5 w-5 fill-white" />}
            {success === false && <XIcon className="h-5 w-5 fill-white" />}
            Create Event
          </button>
        </form>
      </section>
    </>
  );
};

export default CreateEvent;
