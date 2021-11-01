import { FunctionComponent, useState } from "react";

import { classNames } from "utils";

const Sidebar: FunctionComponent = () => {
    const [open, setOpen] = useState(false);

    return (
        <aside className={classNames("h-screen bg-white rounded-lg shadow-md overflow-hidden relative", {
            "w-screen sm:w-96": open,
            "w-14 sm:w-[4.5rem]": open === false
        })}>

        </aside>
    );
}

export default Sidebar;
