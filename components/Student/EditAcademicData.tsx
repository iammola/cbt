import useSWR from "swr";
import { FunctionComponent, useEffect, useState } from "react";

import Select from "components/Select";

import type { RouteData, RouteError, StudentRecord } from "types";
import type { AllTermsGetData, ClassesGETData, ClassSubjectGETData } from "types/api";

export const EditAcademicData: FunctionComponent<Props> = ({ id }) => {
  const [subjects, setSubjects] = useState<{ _id: any; name: string }[]>([]);
  const [selectedTerm, setSelectedTerm] = useState({
    _id: "",
    name: "Select term",
  });
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    name: "Select class",
  });
  const [update, setUpdate] = useState<StudentAcademic>();
  const [data, setData] = useState<StudentAcademic | null>();
  const { data: terms } = useSWR<RouteData<AllTermsGetData>, RouteError>("/api/terms/all");
  const { data: classes } = useSWR<RouteData<ClassesGETData>, RouteError>("/api/classes/?select=name");

  async function getAcademicData() {
    if (!selectedTerm._id || selectedTerm._id === data?.term.toString()) return;

    setSubjects([]);
    setData(undefined);
    setUpdate(undefined);
    setSelectedClass({
      _id: "",
      name: "Select class",
    });

    try {
      const res = await fetch(`/api/students/${id}/academic?term=${selectedTerm._id}`);
      const result = await res.json();

      if (result.success) setData(result.data[0] ?? null);
      else throw new Error(result.error);
    } catch (error) {
      console.log({ error });
    }
  }

  async function updateAcademicDate() {
    if (!update?.class) return;

    try {
      const res = await fetch(`/api/students/${id}/academic/`, {
        method: "PUT",
        body: JSON.stringify(update),
      });
      const result = await res.json();

      if (result.success && result.data.ok) alert("Success");
      else throw new Error(result.error);
    } catch (error) {
      console.log({ error });
      alert("Error updating data");
    }
  }

  async function deleteAcademicData() {
    if (!selectedTerm._id) return;

    try {
      const res = await fetch(`/api/students/${id}/academic/?term=${selectedTerm._id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success && result.data.ok) alert("Success");
      else throw new Error(result.error);
    } catch (error) {
      console.log({ error });
      alert("Error deleting data");
    }
  }

  useEffect(() => {
    if (data === undefined || update !== undefined) return;
    if (data === null) return setUpdate({ term: selectedTerm._id } as unknown as StudentAcademic);

    const activeClass = classes?.data.find((d) => d._id === data.class);

    setUpdate(data);
    setSelectedClass({
      _id: activeClass?._id.toString() ?? "",
      name: activeClass?.name ?? "Class not found",
    });
  }, [classes?.data, data, selectedTerm._id, update]);

  useEffect(() => {
    async function fetchSubjects() {
      setSubjects([]);

      try {
        const res = await fetch(`/api/classes/${selectedClass._id}/subjects`);
        const result = await res.json();

        if (result.success) setSubjects((result.data as ClassSubjectGETData)?.subjects ?? []);
        else throw new Error(result.error);
      } catch (error: any) {
        console.log({ error });
      }
    }

    if (selectedClass._id) fetchSubjects();
  }, [selectedClass]);

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex w-full items-center justify-start gap-x-6 border-b border-slate-300 py-3">
        <Select
          label="Term"
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
        <button
          type="button"
          onClick={getAcademicData}
          className="min-w-max shrink-0 rounded-md bg-gray-600 px-5 py-2 text-sm tracking-wide text-white"
        >
          Load Data
        </button>
      </div>
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
      <div className="mt-2 flex w-full min-w-[20rem] flex-col gap-2">
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
                    const length = update?.subjects.length ?? 0;
                    e.checked = length === subjects.length;
                    e.indeterminate = length > 0 && length < subjects.length;
                  }
                }}
                onChange={(e) =>
                  update &&
                  setUpdate({
                    ...update,
                    subjects: e.target.checked ? subjects.map(({ _id }) => _id) : [],
                  })
                }
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
                checked={update?.subjects.includes(_id)}
                onChange={({ target: { checked } }) =>
                  update &&
                  setUpdate({
                    ...update,
                    subjects: checked
                      ? [...update.subjects, _id]
                      : update.subjects.filter((selected) => selected !== _id),
                  })
                }
              />
              {name}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-start gap-x-4 py-2">
        <button
          type="button"
          onClick={updateAcademicDate}
          className="rounded-md bg-gray-500 px-4 py-3 tracking-wide text-white"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={deleteAcademicData}
          className="rounded-md bg-red-700 px-4 py-3 tracking-wide text-white"
        >
          Delete Term
        </button>
      </div>
    </div>
  );
};

type Props = Record<"id", string>;

type StudentAcademic = StudentRecord["academic"][number];
