import useSWR from "swr";
import { useCookies } from "react-cookie";
import { FunctionComponent } from "react";

import { Subjects } from "components/Misc";
import { Sidebar, Navbar } from "components/Layout";

const Home: FunctionComponent = () => {
    const [{ account }] = useCookies(['account']);
    const { data: subjectsItems } = useSWR(account !== undefined ? `/api/teachers/${account._id}/subjects/extend` : null, url => url !== null && fetch(url).then(res => res.json()));

    return (
        <section className="flex items-center justify-start w-screen h-screen divide-y-[1.5px] divide-gray-200">
            <Sidebar />
            <main className="flex flex-col grow items-center justify-center divide-x-[1.5px] divide-gray-200 h-full">
                <section className="flex flex-col gap-7 items-start justify-start w-full py-7 px-6 grow bg-gray-50 overflow-y-auto">
                    <Navbar />
                    <h2 className="text-3xl sm:text-5xl font-bold text-gray-700">
                        Dashboard
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-12 grid-row-2 xl:grid-rows-6 gap-5 grow w-full rounded-lg">
                        <div className="flex flex-col items-start justify-center col-start-1 col-end-2 xl:col-end-10 row-start-1 row-end-2 xl:row-end-5 rounded-3xl shadow-md px-7 py-8 bg-white">

                        </div>
                        <div className="col-start-1 xl:col-start-10 col-end-2 xl:col-end-13 row-start-2 xl:row-start-1 row-end-3 xl:row-end-7 rounded-3xl shadow-md px-7 py-8 bg-white">
                            <h5 className="font-semibold text-gray-700 pl-1 pb-4">
                                Subjects
                            </h5>
                            <Subjects items={subjectsItems?.data} />
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default Home;
