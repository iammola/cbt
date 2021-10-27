import { FunctionComponent } from "react";

import { Calendar } from "components/Misc";

const Sidebar: FunctionComponent = () => {
    return (
        <aside className="flex flex-col gap-8 py-7 px-4 w-80">
            <Calendar
                month={9}
                year={2021}
                events={[{ date: 3, count: 5 }, { date: 15, count: 1 }, { date: 18, count: 2 }]}
            />
        </aside>
    )
}

export default Sidebar;
