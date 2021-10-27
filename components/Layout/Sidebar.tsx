import { FunctionComponent } from "react";

import { Calendar } from "components/Misc";

const Sidebar: FunctionComponent = () => {
    return (
        <aside>
            <Calendar
                month={9}
                year={2021}
            />
        </aside>
    )
}

export default Sidebar;
