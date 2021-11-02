import { FunctionComponent, useState } from "react";

import { classNames } from "utils";

import { Brand, Menu, Theme, Toggle } from "./components";

import { Divide } from "components/Misc";

const Sidebar: FunctionComponent = () => {
    const [open, setOpen] = useState(false);

    return (
        <aside className={classNames("flex flex-col gap-5 items-center justify-start py-5 px-3 max-w-full h-screen bg-white rounded-lg shadow-sm relative", {
            "w-screen sm:w-[20rem]": open,
            "w-20 sm:w-[6.5rem]": open === false
        })}>
            <Toggle
                open={open}
                toggleOpen={() => setOpen(!open)}
            />
            <Brand open={open} />
            <Divide className="w-[85%] max-w-full" />
            <Menu open={open} />
            <Divide className="w-[85%] max-w-full" />
            <Theme />
        </aside>
    );
}

export default Sidebar;
