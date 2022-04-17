import { Sidebar, Navbar } from "components/Layout";

import type { NextPage } from "next";

const Student: NextPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-start divide-y-[1.5px] divide-gray-200">
      <Sidebar />
      <main className="flex h-full grow flex-col items-center justify-center divide-x-[1.5px] divide-gray-200">
        <Navbar />
        <section className="flex w-full grow flex-col items-start justify-start gap-7 overflow-y-auto bg-gray-50 py-7 px-6"></section>
      </main>
    </section>
  );
};

export default Student;
