import useSWR from "swr";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Exams from "./Exams";
import Results from "./Results";

import type { RouteData } from "types";
import type { StudentClassGETData } from "types/api";

const Home: React.FC = () => {
  const router = useRouter();
  const [{ account }, , removeCookies] = useCookies(["account"]);
  const { data: classData, error } = useSWR<RouteData<StudentClassGETData>>(`/api/students/${account?._id}/class/`);

  const signOut = () => router.push("/").then(() => removeCookies("account", { path: "/" }));

  return (
    <section className="flex h-screen w-screen flex-col items-start justify-start">
      <header className="flex w-full items-center justify-between border-b-2 border-slate-200 bg-white py-6 px-5">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-wider text-slate-700">Dashboard 🚀</h2>
          <div className="text-sm tracking-wide">
            <span className="text-slate-500">Logged in as</span>{" "}
            <span className="font-medium text-slate-700">{account?.name?.full}</span>
            {(classData?.data || error) && (
              <>
                {" "}
                <span className="text-slate-500">•</span>{" "}
                <span className="font-medium text-slate-700">
                  {classData?.data.name ?? (error !== undefined && "Couldn't load class")}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="cursor-pointer rounded-full bg-blue-500 py-2 px-8 text-sm text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Sign out
        </button>
      </header>
      <main className="w-full grow space-y-14 bg-gray-50 py-8 px-10">
        <Exams />
        <Results />
      </main>
    </section>
  );
};

export default Home;
