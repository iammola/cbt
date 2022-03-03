import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { BriefcaseIcon } from "@heroicons/react/solid";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { classNames } from "utils";
import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";
import { useNotifications } from "components/Misc/Notification";

import type { ClassesGETData, ClassSubjectGETData } from "types/api/classes";
import type {
  ClassRecord,
  ClientResponse,
  RouteData,
  RouteError,
  SubjectRecord,
} from "types";

const CreateTeachers: NextPage = () => {
  const [addNotification, , Notifications] = useNotifications();
  const [email, setEmail] = useState("");
  const [selectedTitle, setSelectedTitle] = useState({
    _id: "",
    name: "Select title",
  });
  const [name, setName] = useState<{
    [K in "full" | "first" | "last" | "initials"]?: string;
  }>({});

  const titleOptions = useMemo(
    () => [
      {
        _id: "Mr.",
        name: "Mr.",
      },
      {
        _id: "Mrs.",
        name: "Mrs.",
      },
      {
        _id: "Ms.",
        name: "Ms.",
      },
      {
        _id: "Dr.",
        name: "Dr.",
      },
      {
        _id: "Master",
        name: "Master",
      },
    ],
    []
  );

  const { data: classes, error } = useSWR<
    RouteData<ClassesGETData>,
    RouteError
  >("/api/classes/?select=name", (url) => fetch(url).then((res) => res.json()));

  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: string]: string[];
  }>({});
  const [subjectsData, setSubjectsData] = useState<
    { _id: string; name: string; subjects: SubjectRecord[] }[] | string
  >("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();

  useEffect(() => {
    if (typeof subjectsData === "string") {
      if (error !== undefined && classes === undefined)
        setSubjectsData("⚠️ Error loading subjects");
      else if (classes === undefined) setSubjectsData("Loading classes...");
      else setSubjectsData("Loading subjects...");
    }
  }, [classes, error, subjectsData]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const data = await Promise.all(
          (classes?.data as Pick<ClassRecord, "_id" | "name">[]).map(
            async ({ _id, name }) => {
              const res = await fetch(`/api/classes/${_id}/subjects`);
              const result =
                (await res.json()) as ClientResponse<ClassSubjectGETData>;

              return {
                _id: _id.toString(),
                name,
                subjects: result.success ? result.data?.subjects ?? [] : [],
              };
            }
          )
        );
        setSubjectsData(data.filter(({ subjects }) => subjects.length > 0));
      } catch (error: any) {
        console.log({ error });
      }
    }

    if (classes !== undefined) fetchSubjects();
  }, [classes]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/teachers/", {
        method: "POST",
        body: JSON.stringify({
          email,
          name: { ...name, title: selectedTitle._id },
          subjects: selectedSubjects,
        }),
      });
      const { success, data, error } = await res.json();

      setSuccess(success);

      if (success) {
        addNotification({
          timeout: 75e2,
          message: `Success... ${name.first}'s code is ${data.code}`,
          Icon: () => <BriefcaseIcon className="h-5 w-5 text-indigo-600" />,
        });
        setName({});
        setEmail("");
        setSelectedTitle({
          _id: "",
          name: "Select title",
        });
        setSelectedSubjects({});
      } else throw new Error(error);
    } catch (error: any) {
      console.log({ error });
    }

    setLoading(false);
    setTimeout(setSuccess, 15e2, undefined);
  }

  return (
    <>
      <Head>
        <title>Create Teacher Profile | CBT | Grand Regal School</title>
        <meta name="description" content="Teacher Registration | GRS CBT" />
      </Head>
      <section className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-purple-400 to-pink-500 p-10">
        <form
          onSubmit={handleSubmit}
          className="flex min-w-min max-w-[75%] flex-col gap-7 rounded-3xl bg-white p-8 shadow-lg"
        >
          <h1 className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
            <span>Create a</span>{" "}
            <span className="text-pink-500">Teacher Profile</span>
          </h1>
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="fullName"
              className="text-sm font-semibold text-gray-600"
            >
              Full Name
            </label>
            <input
              required
              type="text"
              id="fullName"
              value={name.full ?? ""}
              onChange={(e) => setName({ ...name, full: e.target.value })}
              className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex flex-col gap-2.5">
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
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <Select
              label="Title"
              options={titleOptions}
              selected={selectedTitle}
              handleChange={setSelectedTitle}
              colorPallette={{
                activeCheckIconColor: "stroke-pink-600",
                inactiveCheckIconColor: "stroke-pink-800",
                activeOptionColor: "text-pink-900 bg-pink-100",
                buttonBorderColor: "focus-visible:border-pink-500",
                buttonOffsetFocusColor: "focus-visible:ring-offset-pink-500",
              }}
            />
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
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
          <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
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
              className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
            <span className="text-sm font-semibold text-gray-600">
              Subjects
            </span>
            <div className="flex w-full flex-col gap-y-4">
              {typeof subjectsData === "string" ? (
                <span className="text-center text-sm">{subjectsData}</span>
              ) : subjectsData.length > 0 ? (
                subjectsData.map(({ _id: classID, name, subjects }) => (
                  <div key={classID} className="flex flex-col gap-2">
                    <span className="flex w-full items-center justify-start gap-3 text-xs font-medium text-gray-600">
                      {name}
                      <label
                        htmlFor={`selectAll${name}`}
                        className="flex items-center justify-start gap-2 text-gray-500"
                      >
                        <input
                          type="checkbox"
                          id={`selectAll${name}`}
                          className="accent-pink-500"
                          ref={(e) => {
                            if (e !== null) {
                              e.checked =
                                selectedSubjects[classID]?.length ===
                                subjects.length;
                              e.indeterminate =
                                selectedSubjects[classID]?.length > 0 &&
                                selectedSubjects[classID]?.length <
                                  subjects.length;
                            }
                          }}
                          onChange={(e) =>
                            setSelectedSubjects(
                              e.target.checked
                                ? {
                                    ...selectedSubjects,
                                    [classID]: subjects.map(({ _id }) =>
                                      _id.toString()
                                    ),
                                  }
                                : Object.fromEntries(
                                    Object.entries(selectedSubjects).filter(
                                      ([key]) => key !== classID
                                    )
                                  )
                            )
                          }
                        />
                        Select All
                      </label>
                    </span>
                    <div className="flex w-full flex-wrap gap-x-4 gap-y-3 text-sm text-gray-700">
                      {subjects.map(({ _id, name }) => (
                        <label
                          key={_id.toString()}
                          htmlFor={_id.toString()}
                          className="flex gap-3 p-2"
                        >
                          <input
                            id={_id.toString()}
                            type="checkbox"
                            className="accent-pink-500"
                            checked={(selectedSubjects[classID] ?? []).includes(
                              _id.toString()
                            )}
                            onChange={({ target: { checked } }) => {
                              checked
                                ? setSelectedSubjects({
                                    ...selectedSubjects,
                                    [classID]: [
                                      ...(selectedSubjects[classID] ?? []),
                                      _id.toString(),
                                    ],
                                  })
                                : setSelectedSubjects(
                                    Object.fromEntries(
                                      Object.entries(selectedSubjects)
                                        .map(([key, selected]) => [
                                          key,
                                          key === classID
                                            ? selected.filter(
                                                (i) => i !== _id.toString()
                                              )
                                            : selected,
                                        ])
                                        .filter(
                                          ([, selected]) => selected.length > 0
                                        )
                                    )
                                  );
                            }}
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-center text-sm">No subjects found</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className={classNames(
              "mt-3 flex items-center justify-center gap-4 rounded-md py-2.5 px-3 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white",
              {
                "bg-pink-400 hover:bg-pink-500 focus:ring-pink-500":
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
            Create Profile
          </button>
        </form>
      </section>
      {Notifications}
    </>
  );
};

export default CreateTeachers;
