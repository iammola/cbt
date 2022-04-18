import useSWR from "swr";
import { useCookies } from "react-cookie";
import Subjects from "./Subjects";
import { Sidebar, Navbar } from "components/Layout";

import type { RouteData } from "types";
import type { TeacherSubjectsExtendGETData } from "types/api";

const Home: React.FC = () => {
  const [{ account }] = useCookies(["account"]);
  const { data: subjectsItems } = useSWR<RouteData<TeacherSubjectsExtendGETData>>(
    account !== undefined ? `/api/teachers/${account._id}/subjects/extend` : null
  );

  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <main className="flex h-full grow flex-col items-center justify-center divide-x-[1.5px] divide-gray-200">
        <Navbar />
        <section className="flex w-full grow flex-col items-start justify-start gap-7 overflow-y-auto bg-gray-50 py-7 px-6">
          <h2 className="text-3xl font-bold text-gray-700 sm:text-5xl">Dashboard</h2>
          <div className="grid-row-2 grid w-full grow grid-cols-1 gap-5 rounded-lg xl:grid-cols-12 xl:grid-rows-6">
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-start justify-center rounded-3xl bg-white px-7 py-8 shadow-md xl:col-end-10 xl:row-end-5"></div>
            <div className="col-start-1 col-end-2 row-start-2 row-end-3 rounded-3xl bg-white px-7 py-8 shadow-md xl:col-start-10 xl:col-end-13 xl:row-start-1 xl:row-end-7">
              <h5 className="pl-1 pb-4 font-semibold text-gray-700">Subjects</h5>
              <Subjects items={subjectsItems?.data} />
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Home;
