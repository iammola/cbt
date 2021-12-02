import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FunctionComponent, useState } from "react";

import Exams from "./Exams";
import Results from "./Results";

import { classNames } from "utils";
import { useNotifications } from "components/Misc/Notification";

const Home: FunctionComponent = () => {
    const router = useRouter();
    const [{ account }, , removeCookies] = useCookies(['account']);
    const [activeTab, setActiveTab] = useState('Exams');
    const [greeting, setGreeting] = useState('Good morning');

    const [addNotification, , Notifications] = useNotifications();

    return (
        <section className="w-screen h-screen bg-gray-200/25">
            <div className="flex items-center justify-start gap-5 bg-white w-full h-28 shadow-sm px-10 md:px-16 xl:px-20 py-4">
                <div className="flex items-center justify-start gap-3 grow py-2 relative">
                    <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-full overflow-hidden font-medium text-white bg-gray-400 text-lg cursor-pointer">
                        {account?.name.initials}
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 tracking-wider">
                        {greeting}, {account?.name.first}.
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        removeCookies("account", { path: '/' });
                        router.push('/');
                    }}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-md shadow-md bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold cursor-pointer"
                >
                    Log out
                </button>
            </div>
            <div className="px-10 md:px-16 xl:px-20 w-full">
                <div className="flex gap-12 mt-10 border-b-2 w-max min-w-full mb-8">
                    {["Exams", "Results"].map(label => (
                        <div
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={classNames("group flex items-center relative px-2 pb-3 gap-3.5 cursor-pointer after:absolute after:w-full after:h-0.5 after:left-0 after:-bottom-0.5 after:transition-all hover:after:bg-gray-600", {
                                "after:bg-gray-600": activeTab === label
                            })}
                        >
                            <span
                                className={classNames("font-semibold w-max group-hover:text-gray-800 transition-all", {
                                    "text-gray-600": activeTab !== label,
                                    "text-gray-800": activeTab === label
                                })}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
                {activeTab === "Exams" ? (
                    <Exams addNotification={addNotification} />
                ) : (
                    <Results />
                )}
            </div>
            {Notifications}
        </section>
    );
}

export default Home;
