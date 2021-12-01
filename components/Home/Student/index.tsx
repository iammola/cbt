import { FunctionComponent } from "react";

import Exams from "./Exams";

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
                <Exams />
            </div>
        </section>
    );
}

export default Home;
