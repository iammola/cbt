import { format } from "date-fns";
import { FormEvent, FunctionComponent, useState } from "react";

import Select from "components/Select";

import type { StudentGETData } from "types/api";

export const EditData: FunctionComponent<Props> = ({ onSubmit, ...props }) => {
  const [data, setData] = useState(props);
  const [genders] = useState([
    { _id: "F", name: "Female" },
    { _id: "M", name: "Male" },
  ]);
  const updateData = <T extends keyof Props>(key: T, value: Props[T]) => setData((old) => ({ ...old, [key]: value }));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-x-5 gap-y-4"
    >
      <div className="flex w-full max-w-[30rem] flex-col gap-2.5">
        <label
          htmlFor="fullName"
          className="min-w-[20rem] text-sm font-semibold text-gray-600"
        >
          Full Name
        </label>
        <input
          required
          type="text"
          id="fullName"
          value={data.name.full}
          onChange={(e) => updateData("name", { ...data.name, full: e.target.value })}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex w-full max-w-[10rem] flex-col gap-2.5">
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
          value={data.name.initials ?? ""}
          onChange={(e) => updateData("name", { ...data.name, initials: e.target.value })}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex w-full max-w-[20rem] flex-col gap-2.5">
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
          value={data.email}
          onChange={({ target: { value } }) => updateData("email", value)}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex w-full max-w-[20rem] flex-col gap-2.5">
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
          value={data.name.first ?? ""}
          onChange={(e) => updateData("name", { ...data.name, first: e.target.value })}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex w-full max-w-[20rem] flex-col gap-2.5">
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
          value={data.name.last ?? ""}
          onChange={(e) => updateData("name", { ...data.name, last: e.target.value })}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="max-w-[20rem]">
        <Select
          label="Gender"
          colorPallette={{
            activeCheckIconColor: "stroke-indigo-600",
            inactiveCheckIconColor: "stroke-indigo-800",
            activeOptionColor: "text-indigo-900 bg-indigo-100",
            buttonBorderColor: "focus-visible:border-indigo-500",
            buttonOffsetFocusColor: "focus-visible:ring-offset-indigo-500",
          }}
          options={genders}
          handleChange={(e) => updateData("gender", e._id as "M" | "F")}
          selected={genders.find((g) => g._id === data.gender) ?? genders[0]}
        />
      </div>
      <div className="flex w-full max-w-[12.5rem] flex-col gap-2.5">
        <label
          htmlFor="birthday"
          className="text-sm font-semibold text-gray-600"
        >
          Birthday
        </label>
        <input
          required
          type="date"
          id="birthday"
          value={format(new Date(data.birthday), "yyyy-MM-dd")}
          onChange={(e) => updateData("birthday", e.target.valueAsDate ?? new Date(data.birthday))}
          className="rounded-md border p-3 pl-5 transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="w-full">
        <button
          type="submit"
          className="mt-3 flex items-center justify-center gap-4 rounded-md bg-indigo-400 py-2.5 px-3 text-white shadow-md transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  focus:ring-offset-white"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

type P = NonNullable<StudentGETData>;
type Props = Omit<P, "academic"> & { onSubmit(props: Omit<P, "academic">): void };

export default EditData;
