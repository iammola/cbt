import Head from "next/head";
import type { NextPage } from "next";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { useState, FormEvent, useMemo, useEffect } from "react";

import { classNames } from "utils";
import { LoadingIcon } from "components/Misc/Icons";

const CreateSession: NextPage = () => {
  const termTemplate = useMemo(
    () => ({
      name: "",
      alias: "",
    }),
    []
  );
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [current, setCurrent] = useState(false);
  const [terms, setTerms] = useState<
    { name: string; alias: string; current?: boolean }[]
  >([{ ...termTemplate }]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sessions/", {
        method: "POST",
        body: JSON.stringify({ name, alias, current, terms }),
      });
      const { success, error } = await res.json();

      setSuccess(success);

      if (success === true) {
        setName("");
        setAlias("");
        setCurrent(false);
        setTerms([{ ...termTemplate }]);
      } else throw new Error(error);
    } catch (error: any) {
      console.log({ error });
    }

    setLoading(false);
    setTimeout(setSuccess, 15e2, undefined);
  }

  useEffect(() => {
    if (current === true && terms.every((term) => !!term.current === false))
      setTerms((terms) => [{ ...terms[0], current }, ...terms.slice(1)]);
    if (current === false && terms.some((term) => term.current === true))
      setTerms((terms) => terms.map((term) => ({ ...term, current })));
  }, [current, terms]);

  return (
    <>
      <Head>
        <title>
          Create a School Session // Term | CBT | Grand Regal School
        </title>
        <meta
          name="description"
          content="School Session // Term Registration | GRS CBT"
        />
      </Head>
      <section className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-yellow-400 to-pink-500 p-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-lg"
        >
          <h1 className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
            <span>Create a</span>{" "}
            <span className="text-amber-500">Session</span>
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
          <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
            <span className="text-sm font-semibold text-gray-600">Terms</span>
            {terms.map((term, termIdx) => (
              <div
                key={termIdx}
                className="flex flex-wrap items-center justify-start gap-3"
              >
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={term.name}
                  onChange={({ target: { value } }) =>
                    setTerms(
                      terms.map((term, i) =>
                        i === termIdx ? { ...term, name: value } : term
                      )
                    )
                  }
                  className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  required
                  type="text"
                  placeholder="Alias"
                  value={term.alias}
                  onChange={({ target: { value } }) =>
                    setTerms(
                      terms.map((term, i) =>
                        i === termIdx ? { ...term, alias: value } : term
                      )
                    )
                  }
                  className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <label
                  htmlFor={`Term${termIdx}`}
                  className="flex shrink-0 items-center gap-3 p-2 text-sm"
                >
                  <input
                    type="checkbox"
                    id={`Term${termIdx}`}
                    className="accent-amber-500"
                    checked={term.current ?? false}
                    onChange={({ target: { checked } }) =>
                      setTerms(
                        terms.map((term, i) => ({
                          ...term,
                          current:
                            current === true &&
                            i === (checked === true ? termIdx : 0),
                        }))
                      )
                    }
                  />
                  Mark as active term
                </label>
                {terms.length > 1 && (
                  <span
                    onClick={() =>
                      setTerms(terms.filter((_, i) => i !== termIdx))
                    }
                    className="rounded-full p-1 hover:bg-gray-300"
                  >
                    <XIcon className="h-4 w-4 fill-gray-500 hover:fill-gray-600" />
                  </span>
                )}
              </div>
            ))}
            <span
              onClick={() => setTerms([...terms, { ...termTemplate }])}
              className="w-max cursor-pointer text-xs text-blue-400 hover:text-blue-500 hover:underline"
            >
              Add Term
            </span>
          </div>
          <div className="flex w-full min-w-[20rem]">
            <label
              htmlFor="current"
              className="flex w-full items-center gap-3 p-2"
            >
              <input
                id="current"
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
                "bg-amber-400 hover:bg-amber-500 focus:ring-amber-500":
                  success === undefined,
                "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500":
                  success === true,
                "bg-red-400 hover:bg-red-500 focus:ring-red-500":
                  success === false,
              }
            )}
          >
            {loading === true && (
              <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />
            )}
            {success === true && <CheckIcon className="h-5 w-5 fill-white" />}
            {success === false && <XIcon className="h-5 w-5 fill-white" />}
            Create Session
          </button>
        </form>
      </section>
    </>
  );
};

export default CreateSession;
