import { FunctionComponent } from "react";

import type { StudentGETData } from "types/api";

export const EditData: FunctionComponent<Props> = () => {
  return <></>;
};

type Props = Omit<StudentGETData, "academic">;

export default EditData;
