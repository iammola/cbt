import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { useState } from "react";

import { classNames } from "utils";
import { LoadingIcon } from "components/Misc/Icons";

const SessionForm: React.FC = () => {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [current, setCurrent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sessions/", {
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
    } catch (error: any) {
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
        <span>Create a</span> <span className="text-amber-500">Session</span>
      </h1>
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
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
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
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
      <div className="flex w-full min-w-[20rem]">
        <label
          htmlFor="currentSession"
          className="flex w-full items-center gap-3 p-2"
        >
          <input
            id="currentSession"
            type="checkbox"
            checked={current}
            className="accent-amber-500"
            onChange={({ target: { checked } }) => setCurrent(checked)}
          />
          Mark as active session
        </label>
      </div>
      <button
        type="submit"
        className={classNames(
          "mt-3 flex items-center justify-center gap-4 rounded-md py-2.5 px-3 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white",
          {
            "bg-amber-400 hover:bg-amber-500 focus:ring-amber-500": success === undefined,
            "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500": success,
            "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
          }
        )}
      >
        {loading && <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />}
        {success && <CheckIcon className="h-5 w-5 fill-white" />}
        {success === false && <XIcon className="h-5 w-5 fill-white" />}
        Create Session
      </button>
    </form>
  );
};

export default SessionForm;
