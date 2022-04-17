import useSWR from "swr";
import Head from "next/head";
import { format } from "date-fns";
import type { NextPage } from "next";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BriefcaseIcon } from "@heroicons/react/outline";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import { classNames } from "utils";
import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";
import { useNotifications } from "components/Misc/Notification";

import type { ClientResponse, RouteData, RouteError } from "types";
import type { AllTermsGetData, ClassesGETData, ClassSubjectGETData } from "types/api";

const CreateStudents: NextPage = () => {
  const [addNotification, , Notifications] = useNotifications();
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState<Date>();
  const [name, setName] = useState<{
    [K in "full" | "first" | "last" | "initials"]?: string;
  }>({});
  const [selectedGender, setSelectedGender] = useState({
    _id: "",
    name: "Select gender",
  });
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Select class",
  });
  const [selectedTerm, setSelectedTerm] = useState({
    _id: "",
    name: "Select term",
  });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const genders = useMemo(
    () => [
      {
        _id: "M",
        name: "Male",
      },
      {
        _id: "F",
        name: "Female",
      },
    ],
    []
  );
  const [subjects, setSubjects] = useState<{ _id: any; name: string }[]>([]);
  const { data: terms } = useSWR<RouteData<AllTermsGetData>, RouteError>("/api/terms/all");
  const { data: classes, error } = useSWR<RouteData<ClassesGETData>, RouteError>("/api/classes/?select=name");

  const [subjectsLoadingState, setSubjectsLoadingState] = useState<boolean | undefined>();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/students/", {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          birthday,
          gender: selectedGender._id,
          academic: {
            term: selectedTerm._id,
            class: selectedClass._id,
            subjects: selectedSubjects,
          },
        }),
      });
      const { success, data, error } = await res.json();

      setSuccess(success);

      if (success) {
        setName({});
        setEmail("");
        setSubjects([]);
        setBirthday(undefined);
        setSelectedClass({ _id: "", name: "Select class" });
        setSelectedGender({ _id: "", name: "Select gender" });
        setSelectedSubjects([]);
        addNotification({
          timeout: 75e2,
          message: `Success... ${name.first}'s code is ${data.code}`,
          Icon: () => <BriefcaseIcon className="h-5 w-5 text-indigo-600" />,
        });
      } else throw new Error(error);
    } catch (error: any) {
      console.log({ error });
    }

    setLoading(false);
    setTimeout(setSuccess, 15e2, undefined);
  }

  useEffect(() => {
    if (classes === undefined || error === undefined)
      setSelectedClass({
        _id: "",
        name:
          error !== undefined && classes === undefined
            ? "⚠️ Error Loading Classes"
            : classes === undefined
            ? "Loading classes..."
            : "Select class",
      });
  }, [classes, error]);

  useEffect(() => {
    async function fetchSubjects() {
      setSubjects([]);
      setSelectedSubjects([]);
      setSubjectsLoadingState(true);

      try {
        const res = await fetch(`/api/classes/${selectedClass._id}/subjects`);
        const result = (await res.json()) as ClientResponse<ClassSubjectGETData>;

        if (result.success) {
          setSubjects(result.data?.subjects ?? []);
          setSubjectsLoadingState(undefined);
        } else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
        setSubjectsLoadingState(false);
      }
    }
    if (selectedClass._id !== "") fetchSubjects();
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedTerm._id && terms?.data !== undefined) {
      const term = terms.data.find((i) => i.current) as unknown as typeof selectedTerm;

      setSelectedTerm(
        term ?? {
          _id: "",
          name: "Select term",
        }
      );
    }
  }, [selectedTerm, terms]);

  return (
    <>
      <Head>
        <title>Create Student Profile | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Student Registration | GRS CBT"
        />
      </Head>
      <section className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-blue-400 to-indigo-500 p-10">
        <form
          onSubmit={handleSubmit}
          className="flex max-w-2xl flex-col gap-7 rounded-3xl bg-white p-8 shadow-lg"
        >
          <h1 className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
            <span>Create a</span> <span className="text-indigo-500">Student Profile</span>
          </h1>
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="fullName"
              className="min-w-[20rem] text-sm font-semibold text-gray-600"
            >
              Full Name
            </label>
            <input
              required
              type="text"
              id="fullName"
              value={name.full ?? ""}
              onChange={(e) => setName({ ...name, full: e.target.value })}
              className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="initials"
                className="text-sm font-semibold text-gray-600"
              >
                Initials
              </label>
              <input
                required
                type="text"
                minLength={2}
                maxLength={3}
                id="initials"
                value={name.initials ?? ""}
                onChange={(e) => setName({ ...name, initials: e.target.value })}
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-600"
              >
                E-mail
              </label>
              <input
                required
                id="email"
                type="email"
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-gray-600"
              >
                First Name
              </label>
              <input
                required
                type="text"
                id="firstName"
                value={name.first ?? ""}
                onChange={(e) => setName({ ...name, first: e.target.value })}
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="lastName"
                className="text-sm font-semibold text-gray-600"
              >
                Last Name
              </label>
              <input
                required
                type="text"
                id="lastName"
                value={name.last ?? ""}
                onChange={(e) => setName({ ...name, last: e.target.value })}
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-4">
            <Select
              label="Gender"
              colorPallette={{
                activeCheckIconColor: "stroke-indigo-600",
                inactiveCheckIconColor: "stroke-indigo-800",
                activeOptionColor: "text-indigo-900 bg-indigo-100",
                buttonBorderColor: "focus-visible:border-indigo-500",
                buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
              }}
              options={genders}
              selected={selectedGender}
              handleChange={setSelectedGender}
            />
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="birthday"
                className="text-sm font-semibold text-gray-600"
              >
                Birthday
              </label>
              <input
                required
                type="date"
                id="birthday"
                onChange={(e) => setBirthday(e.target.valueAsDate ?? undefined)}
                value={birthday !== undefined ? format(birthday, "yyyy-MM-dd") : ""}
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <Select
            label="First Term"
            colorPallette={{
              activeCheckIconColor: "stroke-indigo-600",
              inactiveCheckIconColor: "stroke-indigo-800",
              activeOptionColor: "text-indigo-900 bg-indigo-100",
              buttonBorderColor: "focus-visible:border-indigo-500",
              buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
            }}
            options={terms?.data}
            selected={selectedTerm}
            handleChange={setSelectedTerm}
          />
          <Select
            label="Class"
            colorPallette={{
              activeCheckIconColor: "stroke-indigo-600",
              inactiveCheckIconColor: "stroke-indigo-800",
              activeOptionColor: "text-indigo-900 bg-indigo-100",
              buttonBorderColor: "focus-visible:border-indigo-500",
              buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
            }}
            options={classes?.data}
            selected={selectedClass}
            handleChange={setSelectedClass}
          />
          <div className="5 flex w-full min-w-[20rem] flex-col gap-2">
            <span className="flex items-center justify-start gap-3 text-sm font-semibold text-gray-600">
              Subjects
              {subjects.length > 0 && (
                <label
                  htmlFor="selectAll"
                  className="flex items-center justify-start gap-2 text-gray-500"
                >
                  <input
                    type="checkbox"
                    id="selectAll"
                    className="accent-indigo-500"
                    ref={(e) => {
                      if (e !== null) {
                        e.checked = selectedSubjects.length === subjects.length;
                        e.indeterminate = selectedSubjects.length > 0 && selectedSubjects.length < subjects.length;
                      }
                    }}
                    onChange={(e) => setSelectedSubjects(e.target.checked ? subjects.map(({ _id }) => _id) : [])}
                  />
                  Select All
                </label>
              )}
            </span>
            <div className="flex w-full flex-wrap gap-x-4 gap-y-3 text-sm">
              {subjects.map(({ _id, name }) => (
                <label
                  key={_id}
                  htmlFor={_id}
                  className="flex gap-3 p-2"
                >
                  <input
                    id={_id}
                    type="checkbox"
                    className="accent-indigo-500"
                    checked={selectedSubjects.includes(_id)}
                    onChange={({ target: { checked } }) =>
                      checked
                        ? setSelectedSubjects([...selectedSubjects, _id])
                        : setSelectedSubjects(selectedSubjects.filter((selected) => selected !== _id))
                    }
                  />
                  {name}
                </label>
              ))}
              <div className="w-full pt-2 text-center empty:hidden">
                {subjectsLoadingState === undefined &&
                  subjects.length === 0 &&
                  (selectedClass._id !== ""
                    ? "No subjects linked to this class"
                    : classes !== undefined && "Select a class ⬆️")}
                {subjectsLoadingState === false && "Error loading subjects. Change selected class to retry"}
                {subjectsLoadingState && `Loading ${selectedClass.name}'s subjects...`}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={classNames(
              "mt-3 flex items-center justify-center gap-4 rounded-md py-2.5 px-3 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white",
              {
                "bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-500": success === undefined,
                "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500": success,
                "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
              }
            )}
          >
            {loading && <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />}
            {success && <CheckIcon className="h-5 w-5 fill-white" />}
            {success === false && <XIcon className="h-5 w-5 fill-white" />}
            Create Profile
          </button>
        </form>
        {Notifications}
      </section>
    </>
  );
};

export default CreateStudents;
