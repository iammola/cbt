import { FunctionComponent, useEffect, useState } from "react";
import {
  MoonIcon as MoonSolidIcon,
  SunIcon as SunSolidIcon,
} from "@heroicons/react/solid";

import { classNames } from "utils";
import {
  MoonIcon as MoonOutlineIcon,
  SunIcon as SunOutlineIcon,
} from "components/Misc/Icons";

import type { ThemeProps } from "types";

const Theme: FunctionComponent<ThemeProps> = ({ open }) => {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(active);
  const themes = [
    {
      label: "Light",
      Icon: {
        solid: SunSolidIcon,
        outline: SunOutlineIcon,
      },
    },
    {
      label: "Dark",
      Icon: {
        solid: MoonSolidIcon,
        outline: MoonOutlineIcon,
      },
    },
  ];

  useEffect(() => {
    setHovered(active);
  }, [active]);

  return (
    <div className="w-full">
      <span
        className={classNames(
          "w-full inline-block text-gray-400 text-[0.6rem] font-semibold uppercase tracking-wider pb-4",
          {
            "text-center": open === false,
            "pl-5": open === true,
          }
        )}
      >
        Theme
      </span>
      <div className="flex items-center justify-between w-full h-12 p-1 rounded-full overflow-hidden bg-gray-100 relative z-0">
        {themes.map(({ label, Icon }, themeIdx) => (
          <div
            key={themeIdx}
            onClick={() => setActive(themeIdx)}
            onMouseEnter={() => setHovered(themeIdx)}
            onMouseLeave={() => setHovered(active)}
            className="flex gap-2 items-center justify-center grow h-full rounded-full cursor-pointer"
          >
            {active === themeIdx ? (
              <Icon.solid className="w-5 h-5 shrink-0 fill-gray-800" />
            ) : (
              <Icon.outline className="w-5 h-5 shrink-0 fill-gray-800" />
            )}
            <span
              className={classNames("text-sm text-gray-800", {
                hidden: open === false,
              })}
            >
              {label}
            </span>
          </div>
        ))}
        <div
          className={classNames(
            "absolute inset-y-0 z-[-1] w-1/2 h-full py-1 rounded-full duration-500 transition-all",
            {
              "pr-1 left-1": hovered === 0,
              "pl-1 left-[calc(50%-0.25rem)]": hovered === 1,
            }
          )}
        >
          <span className="inline-block bg-white rounded-full w-full h-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Theme;
