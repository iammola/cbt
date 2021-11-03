import { FunctionComponent, useState } from "react";

import { classNames } from "utils";

import { Divide } from "components/Misc";
import { Brand, Menu, Theme, Toggle } from "./components";

const Sidebar: FunctionComponent = () => {
    const [open, setOpen] = useState(false);

    return (
        <aside
            className={classNames("flex flex-col gap-5 items-center justify-start py-5 px-3 max-w-full h-screen bg-white rounded-xl shadow-sm z-50 ", {
                "fixed sm:relative inset-0 w-screen sm:w-[20rem]": open,
                "relative w-20 sm:w-[6.5rem]": open === false
            })}
        >
            <Toggle
                open={open}
                toggleOpen={() => setOpen(!open)}
            />
            <Brand open={open} />
            <Divide className="w-[85%] max-w-full" />
            <Menu open={open} />
            <Divide className="w-[85%] max-w-full" />
            <Theme open={open} />
        </aside>
    );
}

export default Sidebar;