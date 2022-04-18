import { useState } from "react";

import { classNames } from "utils";

import { Divide } from "components/Misc";
import { Brand, Menu, Theme, Toggle } from "./components";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={classNames(
        "z-50 flex h-screen max-w-full shrink-0 flex-col items-center justify-start gap-5 rounded-xl bg-white py-5 px-3 shadow-sm ",
        {
          "fixed inset-0 w-screen sm:relative sm:w-[20rem]": open,
          "relative w-20 sm:w-[6.5rem]": !open,
        }
      )}
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
};

export default Sidebar;
