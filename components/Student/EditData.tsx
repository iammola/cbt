import { FormEvent, FunctionComponent, useState } from "react";

import type { StudentGETData } from "types/api";

export const EditData: FunctionComponent<Props> = ({ onSubmit, ...props }) => {
  const [data, setData] = useState(props);
  const updateData = <T extends keyof Props>(key: T, value: Props[T]) => setData((old) => ({ ...old, [key]: value }));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(data);
  }

  return <form onSubmit={handleSubmit}></form>;
};

type P = NonNullable<StudentGETData>;
type Props = Omit<P, "academic"> & { onSubmit(props: Omit<P, "academic">): void };

export default EditData;
