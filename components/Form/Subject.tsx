import useSWR, { useSWRConfig } from "swr";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

import { classNames } from "utils";

import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";

import type { ClientResponse, RouteData, RouteError } from "types";
import type { ClassesGETData, ClassSubjectPOSTData } from "types/api";

const SubjectForm: React.FC = () => {
  const { mutate } = useSWRConfig();
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();
  const { data: classes, error } = useSWR<RouteData<ClassesGETData>, RouteError>("/api/classes/?select=name");

  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Select class",
  });

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (selectedClass._id !== "") {
      try {
        const res = await fetch(`/api/classes/${selectedClass._id}/subjects/`, {
          method: "POST",
          body: JSON.stringify({ name, alias }),
        });
        const result = (await res.json()) as ClientResponse<ClassSubjectPOSTData>;

        setSuccess(result.success);

        if (result.success) {
          setName("");
          setAlias("");
          setSelectedClass({
            _id: "",
            name: "Select class",
          });

          mutate(`/api/classes/${selectedClass._id}/subjects`);
        } else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }
    }

    setLoading(false);
    setTimeout(setSuccess, 15e2, undefined);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-lg"
    >
      <h1 className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
        <span>Create a</span> <span className="text-blue-500">Subject</span>
      </h1>
      <Select
        label="Classes"
        colorPallette={{
          activeCheckIconColor: "stroke-blue-600",
          inactiveCheckIconColor: "stroke-blue-800",
          activeOptionColor: "text-blue-900 bg-blue-100",
          buttonBorderColor: "focus-visible:border-blue-500",
          buttonOffsetFocusColor: "focus-visible:ring-offset-blue-500",
        }}
        options={classes?.data}
        selected={selectedClass}
        handleChange={setSelectedClass}
      />
      <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
        <label
          htmlFor="name"
          className="text-sm font-semibold text-gray-600"
        >
          Name
        </label>
        <input
          required
          id="name"
          type="text"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
        <label
          htmlFor="alias"
          className="text-sm font-semibold text-gray-600"
        >
          Alias
        </label>
        <input
          required
          id="alias"
          type="text"
          value={alias}
          onChange={({ target: { value } }) => setAlias(value)}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit"
        className={classNames(
          "mt-3 flex items-center justify-center gap-4 rounded-md py-2.5 px-3 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white",
          {
            "bg-blue-400 hover:bg-blue-500 focus:ring-blue-500": success === undefined,
            "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500": success,
            "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
          }
        )}
      >
        {loading && <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />}
        {success && <CheckIcon className="h-5 w-5 fill-white" />}
        {success === false && <XIcon className="h-5 w-5 fill-white" />}
        Create Subject
      </button>
    </form>
  );
};

export default SubjectForm;
