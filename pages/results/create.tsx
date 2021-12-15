import useSWR from "swr";
import Head from "next/head";
import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";

import Select from "components/Select";
import { Divide, UserImage } from "components/Misc";
import { Navbar, Sidebar } from "components/Layout";
import { useNotifications } from "components/Misc/Notification";

import type { SubjectStudentsGETData } from "types/api/subjects";
import type { ClientResponse, RouteData, RouteError, StudentRecord } from "types";
import type { StudentResultSubjectGETData, StudentResultSubjectPOSTData } from "types/api/students";
import type { ClassesGETData, ClassResultSettingsGETData, ClassSubjectGETData } from "types/api/classes";

const Results: NextPage = () => {
    const [addNotifications, removeNotifications, Notifications] = useNotifications();
    const [hardTotal, setHardTotal] = useState<StudentRecord['_id'][]>([]);
    const [settings, setSettings] = useState<ClassResultSettingsGETData>();
    const [scores, setScores] = useState<(Omit<StudentResultSubjectGETData, 'subject'> & { student: StudentRecord['_id']; modified: boolean; })[]>([]);
    const [students, setStudents] = useState<Pick<StudentRecord, '_id' | 'name'>[]>([]);

    const [subjects, setSubjects] = useState<{ _id: any; name: string; }[]>([]);
    const { data: classes } = useSWR<RouteData<ClassesGETData>, RouteError>('/api/classes/?select=name', url => fetch(url).then(res => res.json()));

    const [selectedClass, setSelectedClass] = useState({
        _id: "",
        name: "Select class"
    });
    const [selectedSubject, setSelectedSubject] = useState({
        _id: "",
        name: "Select subject"
    });

    useEffect(() => {
        async function fetchSubjects() {
            setSubjects([]);
            setSelectedSubject({
                _id: "",
                name: "Loading subjects"
            });

            try {
                const res = await fetch(`/api/classes/${selectedClass._id}/subjects`);
                const result = await res.json() as ClientResponse<ClassSubjectGETData>;

                if (result.success === true) {
                    setSubjects(result.data?.subjects ?? []);
                    setSelectedSubject({
                        _id: "",
                        name: "Select subject"
                    });
                } else throw new Error(result.error);
            } catch (error: any) {
                console.log({ error });
            }
        }

        if (selectedClass._id !== "") fetchSubjects();
    }, [selectedClass]);

    async function getData() {
        if (selectedClass._id !== "" && selectedSubject._id !== "") {
            setScores([]);
            setStudents([]);
            setHardTotal([]);
            setSettings(undefined);

            try {
                let notifications = addNotifications([{
                    Icon: () => <></>,
                    message: "Loading Students",
                    timeout: 2e3,
                }, {
                    Icon: () => <></>,
                    message: "Loading Result Template",
                    timeout: 2e3,
                }]);

                const [{ data: settings }, { data: { students } }] = await Promise.all([
                    fetch(`/api/classes/${selectedClass._id}/results/setting/`).then(res => res.json()) as Promise<RouteData<ClassResultSettingsGETData>>,
                    fetch(`/api/subjects/${selectedSubject._id}/students/`).then(res => res.json()) as Promise<RouteData<SubjectStudentsGETData>>
                ]);
                setStudents(students);
                setSettings(settings);

                notifications.forEach(removeNotifications);
                notifications = addNotifications({
                    message: "Loading students scores",
                    Icon: () => <></>,
                    timeout: 2e3,
                });

                const scores = await Promise.all(students.map(async j => {
                    const res = await fetch(`/api/students/${j._id}/results/${selectedSubject._id}/`);
                    const { data: { scores, total } } = await res.json() as RouteData<StudentResultSubjectGETData>;

                    return {
                        scores, total,
                        student: j._id,
                        modified: false
                    };
                }));

                setScores(scores);
                setHardTotal(scores.filter(i => i.total !== undefined).map(i => i.student));
                removeNotifications(notifications[0]);
            } catch (error: any) {
                console.log({ error });
            }
        }
    }

    async function submitData(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            addNotifications({
                message: "Uploading scores",
                Icon: () => <></>,
                timeout: 2e3,
            });
            await Promise.all(scores.filter(i => i.modified).map(async ({ student, scores, total }) => {
                const name = students.find(i => i._id === student)?.name.full ?? "";
                const notificationId = addNotifications({
                    timeout: 2e3,
                    Icon: () => <></>,
                    message: `Saving for ${name}`,
                })[0];
                const res = await fetch(`/api/students/${student}/results/${selectedSubject._id}/`, {
                    method: "POST",
                    body: JSON.stringify({ scores, total })
                });
                const result = await res.json() as RouteData<StudentResultSubjectPOSTData>;

                removeNotifications(notificationId);
                if (result?.data.ok === true) {
                    addNotifications({
                        timeout: 1e3,
                        Icon: () => <></>,
                        message: `Saved ${name}`,
                    });
                    setScores(scores => scores.map(score => score.student === student ? ({
                        ...score,
                        modified: false
                    }) : score));
                } else {
                    const error = (result as any).error;
                    addNotifications([{
                        timeout: 1e3,
                        Icon: () => <></>,
                        message: `Error saving for ${name}`,
                    }, {
                        timeout: 2e3,
                        Icon: () => <></>,
                        message: `Error: ${error}`,
                    }]);

                    throw new Error(error);
                }
            }));
        } catch (error: any) {
            console.log({ error });
        }
    }

    return (
        <>
            <Head>
                <title>Results | Portal | Grand Regal School</title>
                <meta name="description" content="Results | GRS Portal" />
            </Head>
            <section className="flex items-center justify-start w-screen h-screen divide-y-[1.5px] divide-gray-200">
                <Sidebar />
                <main className="flex flex-col grow items-center justify-center divide-x-[1.5px] divide-gray-200 h-full">
                    <Navbar />
                    <section className="flex flex-col gap-3 items-center justify-start w-full py-10 px-6 grow bg-gray-50/80 overflow-y-auto">
                        <div className="flex gap-4 items-end justify-center w-full">
                            <Select
                                label="Class"
                                options={classes?.data}
                                selected={selectedClass}
                                colorPallette={{
                                    activeCheckIconColor: "stroke-indigo-600",
                                    inactiveCheckIconColor: "stroke-indigo-800",
                                    activeOptionColor: "text-indigo-900 bg-indigo-100",
                                    buttonBorderColor: "focus-visible:border-indigo-500",
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={setSelectedClass}
                            />
                            <Select
                                label="Subject"
                                options={subjects}
                                selected={selectedSubject}
                                colorPallette={{
                                    activeCheckIconColor: "stroke-indigo-600",
                                    inactiveCheckIconColor: "stroke-indigo-800",
                                    activeOptionColor: "text-indigo-900 bg-indigo-100",
                                    buttonBorderColor: "focus-visible:border-indigo-500",
                                    buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500"
                                }}
                                handleChange={setSelectedSubject}
                            />
                            <button
                                onClick={getData}
                                className="px-4 py-3 rounded-md shadow-md bg-gray-500 hover:bg-gray-600 text-white text-xs mb-3 min-w-max"
                            >
                                Load Results
                            </button>
                        </div>
                        {(settings !== undefined && students !== undefined) && (
                            <>
                                <Divide className="px-2 py-7 text-gray-200 w-full" />
                                <form
                                    onSubmit={submitData}
                                    className="flex flex-col gap-7 items-center justify-start w-full py-10 px-3 grow"
                                >
                                    <table className="rounded-lg shadow-md overflow-hidden min-w-full">
                                        <thead className="bg-gray-300 text-gray-700">
                                            <tr className="divide-x divide-gray-200">
                                                <th
                                                    scope="col"
                                                    className="relative px-6 py-3"
                                                >
                                                    <span className="sr-only">
                                                        Students
                                                    </span>
                                                </th>
                                                {settings.fields.map(i => (
                                                    <th
                                                        key={i.alias}
                                                        scope="col"
                                                        className="py-5"
                                                    >
                                                        <abbr
                                                            title={`${i.name} - Max score ${i.max}`}
                                                            className="flex items-center justify-center px-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            {i.alias} ({i.max})
                                                        </abbr>
                                                    </th>
                                                ))}
                                                <th
                                                    scope="col"
                                                    className="py-5"
                                                >
                                                    <span className="flex items-center justify-center px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total - Grade
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                                            {students.map(({ _id, name }) => {
                                                const forceTotal = hardTotal.includes(_id);
                                                const { scores: studentScores, total: studentTotal } = scores.find(i => i.student === _id) ?? {};

                                                return (
                                                    <tr
                                                        key={_id.toString()}
                                                        className="divide-x divide-gray-200"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <div className="shrink-0 h-10 w-10 relative">
                                                                    <UserImage
                                                                        src=""
                                                                        layout="fill"
                                                                        objectFit="cover"
                                                                        objectPosition="center"
                                                                        className="rounded-full"
                                                                        initials={{
                                                                            text: name.initials,
                                                                            className: "rounded-full bg-indigo-300"
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span>
                                                                    {name.full}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {settings.fields.map(field => (
                                                            <td
                                                                key={field.alias}
                                                                className="p-2 whitespace-nowrap"
                                                            >
                                                                {forceTotal === false ? (
                                                                    <input
                                                                        min={0}
                                                                        step={.1}
                                                                        pattern="\d+"
                                                                        type="number"
                                                                        max={field.max}
                                                                        inputMode="numeric"
                                                                        className="min-w-[3rem] py-3 w-full h-full text-center text-sm"
                                                                        onChange={e => {
                                                                            const value = +e.target.value;
                                                                            setScores(scores.map(({ modified, student, scores, total }) => ({
                                                                                student, total: _id === student ? undefined : total,
                                                                                modified: modified === false ? student === _id : modified,
                                                                                scores: settings.fields.map(scoreField => ({
                                                                                    fieldId: scoreField._id,
                                                                                    score: (scoreField._id === field._id && _id === student) ? value : (scores?.find(score => score.fieldId === scoreField._id)?.score ?? "") as any
                                                                                })).filter(i => i.score !== ""),
                                                                            })));
    
                                                                            if (value > field.max || value < 0) e.target.reportValidity();
                                                                        }}
                                                                        value={studentScores?.find(i => i.fieldId === field._id)?.score ?? ''}
                                                                        onBeforeInput={(e: FormEvent<HTMLInputElement> & { data: string; }) => /\d|\./.test(e.data) === false && e.preventDefault()}
                                                                    />
                                                                ) : ''}
                                                            </td>
                                                        ))}
                                                        <td
                                                            onDoubleClick={() => setHardTotal(forceTotal ? hardTotal.filter(i => i !== _id) : [...hardTotal, _id])}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-center"
                                                        >
                                                            {forceTotal === false ? (() => {
                                                                const total = studentScores?.reduce((a, b) => a + b.score, 0) ?? 0;
                                                                const scheme = settings.scheme.find(i => total <= i.limit);

                                                                return (studentScores?.length ?? 0) > 0 ? (
                                                                    <abbr
                                                                        title={scheme?.description}
                                                                        className="text-sm text-center"
                                                                    >
                                                                        {total.toFixed(1)} - {scheme?.grade}
                                                                    </abbr>
                                                                ) : '';
                                                            })() : (
                                                                <input
                                                                    min={0}
                                                                    step={.1}
                                                                    pattern="\d+"
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    value={studentTotal ?? ''}
                                                                    max={settings.fields.reduce((a, b) => a + b.max, 0)}
                                                                    className="min-w-[3rem] py-3 w-full h-full text-center text-sm"
                                                                    onChange={e => setScores(scores.map(({ modified, student, scores, total }) => ({
                                                                        student,
                                                                        scores: student === _id ? undefined: scores,
                                                                        total: student === _id ? +e.target.value : total,
                                                                        modified: modified === false ? student === _id : modified,
                                                                    })))}
                                                                    onBeforeInput={(e: FormEvent<HTMLInputElement> & { data: string; }) => /\d|\./.test(e.data) === false && e.preventDefault()}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <button
                                        type="submit"
                                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-7 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white bg-gray-500 hover:bg-gray-600"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </>
                        )}
                    </section>
                </main>
                {Notifications}
            </section>
        </>
    );
}

export default Results;
