import useSWR from "swr";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { FunctionComponent, FormEvent, useState } from "react";

import { classNames } from "utils";
import Select from "components/Select";
import { LoadingIcon } from "components/Misc/Icons";

const TermForm: FunctionComponent = () => {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [current, setCurrent] = useState(false);
  const [selectedSession, setSelectedSession] = useState({
    _id: "",
    name: "Select session",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();

  const { data: sessions } = useSWR("/api/sessions/?select=name", (url) =>
    fetch(url).then((res) => res.json())
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/sessions/${selectedSession._id}/terms`, {
        method: "POST",
        body: JSON.stringify({ name, alias, current }),
      });
      const { success, error } = await res.json();

      setSuccess(success);

      if (success) {
        setName("");
        setAlias("");
        setCurrent(false);
      } else throw new Error(error);
    } catch (error) {
      console.log({ error });
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
        <span>Create a</span> <span className="text-pink-500">Term</span>
      </h1>
      <Select
        label="Session"
        colorPallette={{
          activeCheckIconColor: "stroke-pink-600",
          inactiveCheckIconColor: "stroke-pink-800",
          activeOptionColor: "text-pink-900 bg-pink-100",
          buttonBorderColor: "focus-visible:border-pink-500",
          buttonOffsetFocusColor: "focus-visible:ring-offset-pink-500",
        }}
        options={sessions?.data}
        selected={selectedSession}
        handleChange={setSelectedSession}
      />
      <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
        <label htmlFor="name" className="text-sm font-semibold text-gray-600">
          Name
        </label>
        <input
          required
          id="name"
          type="text"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
        <label htmlFor="alias" className="text-sm font-semibold text-gray-600">
          Alias
        </label>
        <input
          required
          id="alias"
          type="text"
          value={alias}
          onChange={({ target: { value } }) => setAlias(value)}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <div className="flex w-full min-w-[20rem] flex-col">
        <label
          htmlFor="currentTerm"
          className="flex w-full items-center gap-3 p-2"
        >
          <input
            id="currentTerm"
            type="checkbox"
            checked={current}
            className="accent-pink-500"
            onChange={({ target: { checked } }) => setCurrent(checked)}
          />
          Mark as active term
        </label>
        <span className="-mt-2 text-xs text-slate-600">
          (selected session will be marked active)
        </span>
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
            "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
          }
        )}
      >
        {loading && (
          <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />
        )}
        {success && <CheckIcon className="h-5 w-5 fill-white" />}
        {success === false && <XIcon className="h-5 w-5 fill-white" />}
        Create Term
      </button>
    </form>
  );
};

export default TermForm;
