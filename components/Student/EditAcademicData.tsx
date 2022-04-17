import useSWR from "swr";
import { FunctionComponent, useEffect, useState } from "react";

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

  useEffect(() => {
    if (!data) return;
    const activeClass = classes?.data.find((d) => d._id === data.class);

    setUpdate(data);
    setSelectedClass({
      _id: activeClass?._id.toString() ?? "",
      name: activeClass?.name ?? "Class not found",
    });
  }, [classes?.data, data]);

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

  return <></>;
};

type Props = Record<"id", string>;

type StudentAcademic = StudentRecord["academic"][number];
