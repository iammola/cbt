import { useEffect, useState } from "react";
import { MoonIcon as MoonSolidIcon, SunIcon as SunSolidIcon } from "@heroicons/react/solid";

import { classNames } from "utils";
import { MoonIcon as MoonOutlineIcon, SunIcon as SunOutlineIcon } from "components/Misc/Icons";

import type { ThemeProps } from "types";

const Theme: React.FC<ThemeProps> = ({ open }) => {
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
          "inline-block w-full pb-4 text-[0.6rem] font-semibold uppercase tracking-wider text-gray-400",
          {
            "text-center": !open,
            "pl-5": open,
          }
        )}
      >
        Theme
      </span>
      <div className="relative z-0 flex h-12 w-full items-center justify-between overflow-hidden rounded-full bg-gray-100 p-1">
        {themes.map(({ label, Icon }, themeIdx) => (
          <div
            key={themeIdx}
            onClick={() => setActive(themeIdx)}
            onMouseEnter={() => setHovered(themeIdx)}
            onMouseLeave={() => setHovered(active)}
            className="flex h-full grow cursor-pointer items-center justify-center gap-2 rounded-full"
          >
            {active === themeIdx ? (
              <Icon.solid className="h-5 w-5 shrink-0 fill-gray-800" />
            ) : (
              <Icon.outline className="h-5 w-5 shrink-0 fill-gray-800" />
            )}
            <span
              className={classNames("text-sm text-gray-800", {
                hidden: !open,
              })}
            >
              {label}
            </span>
          </div>
        ))}
        <div
          className={classNames(
            "absolute inset-y-0 z-[-1] h-full w-1/2 rounded-full py-1 transition-all duration-500",
            {
              "left-1 pr-1": hovered === 0,
              "left-[calc(50%-0.25rem)] pl-1": hovered === 1,
            }
          )}
        >
          <span className="inline-block h-full w-full rounded-full bg-white"></span>
        </div>
      </div>
    </div>
  );
};

export default Theme;
