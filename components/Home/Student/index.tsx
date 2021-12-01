import { FunctionComponent } from "react";

import Exams from "./Exams";
import { classNames } from "utils";

const Home: FunctionComponent = () => {
    return (
        <section className="w-screen h-screen bg-gray-200/25">
            <div className="flex items-center justify-start gap-5 bg-white w-full h-28 shadow-sm px-10 md:px-16 xl:px-20 py-4">
                <div className="flex items-center justify-start gap-3 grow py-2 relative">
                    <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-full overflow-hidden font-medium text-white bg-gray-400 text-lg cursor-pointer">
                        AA
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 tracking-wider">
                        Good morning, Ademola
                    </h3>
                </div>
                <button
                    type="button"
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
                            className={classNames("group flex items-center relative px-2 pb-3 gap-3.5 cursor-pointer after:absolute after:w-full after:h-0.5 after:left-0 after:-bottom-0.5 after:transition-all hover:after:bg-gray-600", {
                                "after:bg-gray-600": false
                            })}
                        >
                            <span
                                className={classNames("font-semibold w-max group-hover:text-gray-800 transition-all", {
                                    "text-gray-600": true,
                                    "text-gray-800": false
                                })}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
                <Exams />
            </div>
        </section>
    );
}

export default Home;
