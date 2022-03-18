import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FunctionComponent, useState } from "react";

import Exams from "./Exams";
import Results from "./Results";

import { classNames } from "utils";
import { useNotifications } from "components/Misc/Notification";

const Home: FunctionComponent = () => {
  const router = useRouter();
  const [{ account }, , removeCookies] = useCookies(["account"]);
  const [activeTab, setActiveTab] = useState("Exams");
  const [greeting, setGreeting] = useState("Good morning");

  const [addNotification, , Notifications] = useNotifications();

  return (
    <section className="h-screen w-screen bg-gray-200/25">
      <div className="flex h-28 w-full items-center justify-start gap-5 bg-white px-10 py-4 shadow-sm md:px-16 xl:px-20">
        <div className="relative flex grow items-center justify-start gap-3 py-2">
          <div className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-400 text-lg font-medium text-white">
            {account?.name.initials}
          </div>
          <h3 className="text-xl font-bold tracking-wider text-gray-800">
            {greeting}, {account?.name.first}.
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            removeCookies("account", { path: "/" });
            router.push("/");
          }}
          className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-md bg-gray-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-600"
        >
          Log out
        </button>
      </div>
      <div className="w-full px-10 md:px-16 xl:px-20">
        <div className="mt-10 mb-8 flex w-max min-w-full gap-12 border-b-2">
          {["Exams", "Results"].map((label) => (
            <div
              key={label}
              onClick={() => setActiveTab(label)}
              className={classNames(
                "group relative flex cursor-pointer items-center gap-3.5 px-2 pb-3 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:transition-all hover:after:bg-gray-500",
                {
                  "after:bg-gray-500": activeTab === label,
                }
              )}
            >
              <span
                className={classNames("w-max font-semibold transition-all group-hover:text-gray-800", {
                  "text-gray-500": activeTab !== label,
                  "text-gray-800": activeTab === label,
                })}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <Exams
          show={activeTab === "Exams"}
          addNotification={addNotification}
        />
        <Results show={activeTab === "Results"} />
      </div>
      {Notifications}
    </section>
  );
};

export default Home;
