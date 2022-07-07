import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import Select from "components/Select";

import type { LoginData } from "types/api";
import type { TeacherExamModalProps, SelectOption } from "types";

const ExamModal: React.FC<TeacherExamModalProps> = ({ isEdit, open, onSubmit, ...props }) => {
  const [{ account }] = useCookies<"account", { account?: LoginData }>(["account"]);
  const [subjects, setSubjects] = useState<SelectOption[] | undefined>();
  const { data: currentSession } = useSWRImmutable("/api/sessions/current/");
  const { data: classes, error } = useSWRImmutable(
    account?.access === "GroupedUser"
      ? "/api/classes/"
      : account?.access === "Teacher"
      ? `/api/teachers/${account?._id}/classes/`
      : null
  );

  const [duration, setDuration] = useState(0);
  const [createdByName, setCreatedByName] = useState(props.createdBy);
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Loading classes...",
  });
  const [selectedSubject, setSelectedSubject] = useState({
    _id: "",
    name: "Select class first",
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

  useEffect(() => {
    const { _id } = selectedClass;

    async function fetchSubjects() {
      setSelectedSubject({ _id: "", name: "Loading subjects..." });
      try {
        const url =
          account?.access === "GroupedUser"
            ? `/api/classes/${_id}/subjects`
            : account?.access === "Teacher"
            ? `/api/teachers/${account?._id}/classes/${_id}/subjects`
            : null;

        if (url == null) return;
        const res = await fetch(url);
        const { success, data, error } = await res.json();

        if (success) {
          setSubjects(data.subjects);
          setSelectedSubject({ _id: "", name: "Select subject" });
        } else throw new Error(error);
      } catch (error: any) {
        console.error({ error });
      }
    }

    if (_id !== "") fetchSubjects();
  }, [account, selectedClass]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!account) return;
    if (account.access === "GroupedUser" && !createdByName) return alert("Fill in your name field.");

    if (selectedClass._id !== "" && selectedSubject._id !== "" && currentSession?.data) {
      onSubmit({
        name: {
          class: selectedClass.name,
          subject: selectedSubject.name,
          createdBy: createdByName ?? account.name.full,
        },
        duration,
        subject: selectedSubject._id as any,
        term: currentSession?.data.terms[0]._id,
      });
    }
  }

  return (
    <Transition
      appear
      show={open}
      as={Fragment}
    >
      <Dialog
        as="section"
        onClose={() => {}}
        className="fixed inset-0 z-10 flex h-screen w-full items-center justify-center"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300 transition-opacity"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200 transition-opacity"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 z-[-1] h-full w-full bg-black/30" />
        </Transition.Child>
        <Transition.Child
          enter="ease-out duration-300 transition"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200 transition"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-7 rounded-3xl bg-white p-8 shadow-lg sm:w-[30rem]"
          >
            <Dialog.Title className="pb-4 text-center text-4xl font-bold tracking-tight text-gray-800">
              <span>{isEdit ? "Edit" : "Create"} an</span> <span className="text-indigo-500">Exam</span> <span>🚀</span>
            </Dialog.Title>
            {account?.access !== "Teacher" && (
              <div className="flex w-full min-w-[20rem] flex-col gap-2.5">
                <label
                  htmlFor="teacherName"
                  className="text-sm font-semibold text-gray-600"
                >
                  Your Full Name
                </label>
                <input
                  required
                  type="text"
                  id="teacherName"
                  readOnly={isEdit}
                  placeholder="e.g. Mr. John Doe"
                  value={isEdit ? props.createdBy : createdByName ?? ""}
                  onChange={(e) => !isEdit && setCreatedByName(e.target.value)}
                  className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}
            <Select
              label="Classes"
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
            <Select
              label="Subjects"
              options={subjects}
              selected={selectedSubject}
              colorPallette={{
                activeCheckIconColor: "stroke-indigo-600",
                inactiveCheckIconColor: "stroke-indigo-800",
                activeOptionColor: "text-indigo-900 bg-indigo-100",
                buttonBorderColor: "focus-visible:border-indigo-500",
                buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
              }}
              handleChange={setSelectedSubject}
            />
            <div className="relative flex w-full min-w-[20rem] flex-col gap-2.5">
              <label
                htmlFor="duration"
                className="text-sm font-semibold text-gray-600"
              >
                Duration
              </label>
              <input
                min={15}
                step={1}
                required
                pattern="\d+"
                id="duration"
                type="number"
                inputMode="numeric"
                value={duration === 0 ? "" : duration}
                onChange={({ target: { valueAsNumber } }) => setDuration(valueAsNumber)}
                className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="pointer-events-none absolute bottom-4 right-0 z-10 flex items-center pr-2 text-xs text-gray-500">
                mins
              </span>
            </div>
            <button
              type="submit"
              className="mt-7 flex items-center justify-center gap-4 rounded-md bg-indigo-400 py-2.5 px-3 text-white shadow-md transition-colors hover:bg-indigo-500 focus:outline-none  focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              Continue
            </button>
          </form>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ExamModal;
