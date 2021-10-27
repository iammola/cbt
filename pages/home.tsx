import { NextPage } from "next";

import { Navbar, Sidebar } from "components/Layout";

const Home: NextPage = (props) => {
    return (
        <section className="flex flex-col items-center justify-start gap-2 w-screen divide-y-[1.5px] divide-gray-200">
            <Navbar />
            <main className="flex divide-x-[1.5px] divide-gray-200 w-full">
                <Sidebar />
            </main>
        </section>
    )
}

export default Home;
