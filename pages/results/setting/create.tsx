import useSWR from "swr";
import Head from "next/head";
import { NextPage } from "next";
import { useState } from "react";
import { XIcon } from "@heroicons/react/solid";
import { BadgeCheckIcon, BanIcon } from "@heroicons/react/outline";

import Select from "components/Select";
import { useNotifications } from "components/Misc/Notification";

import type { ClassResultTemplate, ClientResponse, RouteData } from "types";
import type { ClassesGETData, AllTermsGetData, ClassResultSettingsPOSTData } from "types/api";

type Fields = Omit<ClassResultTemplate["fields"][number], "_id" | "max"> & {
  max: number | "";
};
type Scheme = Omit<ClassResultTemplate["scheme"][number], "limit"> & {
  limit: number | "";
};

const CreateScheme: NextPage = () => {
  const [addNotifications, , Notifications] = useNotifications();
  const [selectedClass, setSelectedClass] = useState({
    name: "Select class",
    _id: "",
  });
  const [selectedTerm, setSelectedTerm] = useState({
    _id: "",
    name: "Select term",
  });
  const [fields, setFields] = useState<Fields[]>([{ max: 0, name: "", alias: "" }]);
  const [scheme, setScheme] = useState<Scheme[]>([{ limit: 100, grade: "A", description: "Distinction" }]);

  const { data: classes } = useSWR<RouteData<ClassesGETData>>("/api/classes/?select=name");
  const { data: terms } = useSWR<RouteData<AllTermsGetData>>("/api/terms/all/");

  function verifyFields() {
    const { name, alias } = fields.reduce(
      (a, b) => ({
        name: [...(a.name ?? []), b.name],
        alias: [...(a.alias ?? []), b.alias],
      }),
      {} as { [K in keyof Omit<Fields, "max">]: Fields[K][] }
    );

    return new Set(name).size !== name.length
      ? "Duplicate result field name found"
      : new Set(alias).size !== alias.length
      ? "Duplicate result field alias found"
      : undefined;
  }

  function verifyScheme() {
    const { grade, limit, description } = scheme.reduce(
      (a, b) => ({
        grade: [...(a.grade ?? []), b.grade],
        limit: [...(a.limit ?? []), b.limit],
        description: [...(a.description ?? []), b.description],
      }),
      {} as { [K in keyof Scheme]: Scheme[K][] }
    );

    return new Set(grade).size !== grade.length
      ? "Duplicate scheme grade found"
      : new Set(description).size !== description.length
      ? "Duplicate scheme description found"
      : new Set(limit).size !== limit.length
      ? "Duplicate scheme limit found"
      : !limit.includes(100)
      ? "100 limit scheme not found"
      : undefined;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const notifications = [
      {
        timeout: 5e3,
        message: verifyFields() ?? "",
        Icon: () => <BanIcon className="h-6 w-6 stroke-rose-600" />,
      },
      {
        timeout: 5e3,
        message: verifyScheme() ?? "",
        Icon: () => <BanIcon className="h-6 w-6 stroke-rose-600" />,
      },
    ].filter((i) => i.message !== "");

    addNotifications(notifications);

    if (notifications.length === 0 && selectedTerm._id) {
      try {
        const res = await fetch(`/api/classes/${selectedClass._id}/results/setting`, {
          method: "POST",
          body: JSON.stringify({
            fields,
            term: selectedTerm._id,
            scheme: scheme.sort((a, b) => +a.limit - +b.limit),
          }),
        });
        const result = (await res.json()) as ClientResponse<ClassResultSettingsPOSTData>;

        if (result.success)
          addNotifications({
            timeout: 5e3,
            message: "Success",
            Icon: () => <BadgeCheckIcon className="h-6 w-6 stroke-emerald-500" />,
          });
        else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }
    }
  }

  return (
    <section className="flex min-h-screen w-screen items-center justify-center bg-gray-300 p-10">
      <Head>
        <title>Create Scheme | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Create Scheme | GRS CBT"
        />
      </Head>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-3xl bg-white p-8 shadow-lg"
      >
        <h1 className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
          <span>Create a</span> <span className="text-stone-500">Result Setting</span>
        </h1>
        <Select
          label="Term"
          options={terms?.data}
          selected={selectedTerm}
          handleChange={setSelectedTerm}
        />
        <Select
          label="Class"
          options={classes?.data}
          selected={selectedClass}
          colorPallette={{
            activeCheckIconColor: "stroke-indigo-600",
            inactiveCheckIconColor: "stroke-indigo-800",
            activeOptionColor: "text-indigo-900 bg-indigo-100",
            buttonBorderColor: "focus-visible:border-indigo-500",
            buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
          }}
          handleChange={setSelectedClass}
        />
        <div className="flex w-full flex-col items-start justify-start gap-3 py-2">
          <span className="text-sm font-semibold text-gray-600">Marking Scheme</span>
          {scheme.map((s, p, a) => (
            <div
              key={s.limit}
              className="flex w-full items-center justify-start gap-2"
            >
              <input
                required
                type="text"
                value={s.grade}
                placeholder="Grade"
                onChange={(e) => setScheme(a.map((s, j) => (j === p ? { ...s, grade: e.target.value } : s)))}
                className="w-14 rounded-md border border-gray-200 p-2 text-center text-xs font-bold text-gray-700 focus:border-none"
              />
              <input
                required
                type="text"
                value={s.description}
                placeholder="Description"
                onChange={(e) => setScheme(a.map((s, j) => (j === p ? { ...s, description: e.target.value } : s)))}
                className="grow rounded-md border border-gray-200 p-2 text-sm text-gray-700 focus:border-none"
              />
              <input
                required
                max={100}
                step={0.1}
                type="number"
                value={s.limit}
                placeholder="Upper Limit"
                onChange={(e) => setScheme(a.map((s, j) => (j === p ? { ...s, limit: +e.target.value } : s)))}
                className="w-14 rounded-md border border-gray-200 p-2 text-center text-xs font-bold text-gray-700 focus:border-none"
              />
              {a.length > 1 && (
                <span
                  onClick={() => setScheme(a.filter((_, i) => i !== p))}
                  className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-gray-100"
                >
                  <XIcon className="h-5 w-5 fill-gray-600" />
                </span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setScheme([...scheme, { grade: "", description: "", limit: "" }])}
            className="mt-2 flex items-center justify-center gap-4 rounded-full bg-stone-400 py-1.5 px-5 text-sm text-white shadow-md transition-colors hover:bg-stone-500 focus:outline-none  focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            Add Scheme
          </button>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-3 py-2">
          <span className="text-sm font-semibold text-gray-600">Result Fields</span>
          {fields.map((f, b, a) => (
            <div
              key={b}
              className="flex w-full items-center justify-start gap-2"
            >
              <input
                required
                type="text"
                value={f.name}
                placeholder="Name"
                onChange={(e) => setFields(a.map((s, j) => (j === b ? { ...s, name: e.target.value } : s)))}
                className="grow rounded-md border border-gray-200 p-2 text-sm text-gray-700 focus:border-none"
              />
              <input
                required
                type="text"
                value={f.alias}
                placeholder="Alias"
                onChange={(e) => setFields(a.map((s, j) => (j === b ? { ...s, alias: e.target.value } : s)))}
                className="grow rounded-md border border-gray-200 p-2 text-sm text-gray-700 focus:border-none"
              />
              <input
                min={0}
                required
                step={0.1}
                type="number"
                value={f.max}
                placeholder="Max"
                onChange={(e) => setFields(a.map((s, j) => (j === b ? { ...s, max: +e.target.value } : s)))}
                className="w-14 rounded-md border border-gray-200 p-2 text-center text-xs font-bold text-gray-700 focus:border-none"
              />
              {a.length > 1 && (
                <span
                  onClick={() => setFields(a.filter((_, i) => i !== b))}
                  className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-gray-100"
                >
                  <XIcon className="h-5 w-5 fill-gray-600" />
                </span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFields([...fields, { name: "", alias: "", max: "" }])}
            className="mt-2 flex items-center justify-center gap-4 rounded-full bg-stone-400 py-1.5 px-5 text-sm text-white shadow-md transition-colors hover:bg-stone-500 focus:outline-none  focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            Add Field
          </button>
        </div>
        <button
          type="submit"
          className="mt-3 flex items-center justify-center gap-4 rounded-md bg-stone-400 py-2.5 px-3 text-white shadow-md transition-colors hover:bg-stone-500 focus:outline-none  focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Create Result Setting
        </button>
      </form>
      {Notifications}
    </section>
  );
};

export default CreateScheme;
