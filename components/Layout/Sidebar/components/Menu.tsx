import Link from "next/link";
import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { DesktopComputerIcon } from "@heroicons/react/outline";
import { Fragment, FunctionComponent, ReactNode, useState } from "react";

import { classNames } from "utils";
import { CalendarIcon, HomeIcon, FileTextIcon } from "components/Misc/Icons";

import type { MenuProps } from "types";

const Menu: FunctionComponent<MenuProps> = ({ open }) => {
  return (
    <nav
      className={classNames("w-full grow", {
        "px-5": open,
        "px-1 sm:px-4": !open,
      })}
    >
      <span
        className={classNames(
          "inline-block w-full pb-4 text-[0.6rem] font-semibold uppercase tracking-wider text-gray-400",
          {
            "text-center": !open,
          }
        )}
      >
        Menu
      </span>
      <ul className="flex w-full flex-col items-center justify-center gap-y-2">
        <MenuItem>
          <MenuItem.Main>
            <Link href="/home">
              <a
                className={classNames(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                  {
                    "justify-start pr-3": open,
                    "justify-center sm:py-3": !open,
                  }
                )}
              >
                <HomeIcon
                  className={classNames("h-6 w-6 shrink-0", {
                    "ml-3": open,
                  })}
                />
                <span
                  className={classNames("truncate text-sm", {
                    hidden: !open,
                    block: open,
                  })}
                >
                  Dashboard
                </span>
              </a>
            </Link>
          </MenuItem.Main>
        </MenuItem>
        <MenuItem>
          {({ expand, toggleExpand }) => (
            <>
              <MenuItem.Main>
                <div
                  onClick={toggleExpand}
                  className={classNames(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                    {
                      "justify-start pr-3": open,
                      "justify-center": !open,
                    }
                  )}
                >
                  <FileTextIcon
                    className={classNames("h-6 w-6 shrink-0", {
                      "ml-3": open,
                    })}
                  />
                  <span
                    className={classNames("truncate text-sm", {
                      hidden: !open,
                      block: open,
                    })}
                  >
                    Exams
                  </span>
                  <ChevronDownIcon
                    className={classNames("ml-auto h-5 w-5 shrink-0 text-gray-600", {
                      hidden: !open,
                    })}
                  />
                </div>
              </MenuItem.Main>
              {open ? (
                <MenuItem.List expand={expand}>
                  <li className="w-full">
                    <Link href="/exams/create/">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Create an Exam</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/exams/">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">View Exams</span>
                      </a>
                    </Link>
                  </li>
                </MenuItem.List>
              ) : (
                <MenuItem.Panel expand={expand}>
                  <li className="w-full">
                    <Link href="/exams/create/">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Create an Exam</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/exams">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">View Exams</span>
                      </a>
                    </Link>
                  </li>
                </MenuItem.Panel>
              )}
            </>
          )}
        </MenuItem>
        <MenuItem>
          {({ expand, toggleExpand }) => (
            <>
              <MenuItem.Main>
                <div
                  onClick={toggleExpand}
                  className={classNames(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                    {
                      "justify-start pr-3": open,
                      "justify-center": !open,
                    }
                  )}
                >
                  <DesktopComputerIcon
                    className={classNames("h-6 w-6 shrink-0", {
                      "ml-3": open,
                    })}
                  />
                  <span
                    className={classNames("truncate text-sm", {
                      hidden: !open,
                      block: open,
                    })}
                  >
                    Results
                  </span>
                  <ChevronDownIcon
                    className={classNames("ml-auto h-5 w-5 shrink-0 text-gray-600", {
                      hidden: !open,
                    })}
                  />
                </div>
              </MenuItem.Main>
              {open ? (
                <MenuItem.List expand={expand}>
                  <li className="w-full">
                    <Link href="/results/cbt">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">View CBT Results</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/results/comments">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Upload Term Comments</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/results/create">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Upload Term Result</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/results/picker">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">View Term Results</span>
                      </a>
                    </Link>
                  </li>
                </MenuItem.List>
              ) : (
                <MenuItem.Panel expand={expand}>
                  <li className="w-full">
                    <Link href="/results/cbt">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">View CBT Results</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/results/comments">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Upload Term Comments</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/results/create">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Upload Term Result</span>
                      </a>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/results/picker">
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">View Term Result</span>
                      </a>
                    </Link>
                  </li>
                </MenuItem.Panel>
              )}
            </>
          )}
        </MenuItem>
        <MenuItem>
          <MenuItem.Main>
            <Link href="/calendar">
              <a
                className={classNames(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                  {
                    "justify-start pr-3": open,
                    "justify-center sm:py-3": !open,
                  }
                )}
              >
                <CalendarIcon
                  className={classNames("h-6 w-6 shrink-0", {
                    "ml-3": open,
                  })}
                />
                <span
                  className={classNames("truncate text-sm", {
                    hidden: !open,
                    block: open,
                  })}
                >
                  Calendar
                </span>
              </a>
            </Link>
          </MenuItem.Main>
        </MenuItem>
      </ul>
    </nav>
  );
};

const MenuItem: MenuItem = ({ children }) => {
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => setExpand(!expand);

  return <li className="w-full">{typeof children === "function" ? children({ expand, toggleExpand }) : children}</li>;
};

MenuItem.Main = function Main({ children }) {
  return <>{children}</>;
};

MenuItem.List = function List({ expand, children }) {
  return (
    <Transition
      appear
      show={expand}
      as={Fragment}
      enter="ease-out transition-transform origin-top"
      enterFrom="scale-y-0"
      enterTo="scale-y-100"
      leave="ease-in transition-transform origin-top"
      leaveFrom="scale-y-100"
      leaveTo="scale-y-0"
    >
      <ul className="relative flex flex-col gap-y-2 overflow-y-hidden pl-9">
        {children}
        <div className="absolute inset-0 left-6 h-full w-px bg-gray-200"></div>
      </ul>
    </Transition>
  );
};

MenuItem.Panel = function Panel({ expand, children }) {
  return (
    <Transition
      appear
      show={expand}
      as={Fragment}
      enter="ease-out transition origin-top-left"
      enterFrom="scale-0 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="ease-in transition origin-top-left"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-0 opacity-0"
    >
      <ul className="absolute left-10 w-60 rounded-lg bg-white py-5 pl-10 pr-4 shadow-lg">
        <div className="relative flex w-full flex-col gap-y-2">
          {children}
          <div className="absolute inset-0 -left-3 h-full w-px bg-gray-200"></div>
        </div>
      </ul>
    </Transition>
  );
};

type RenderChildren = (o: { expand: boolean; toggleExpand(): void }) => ReactNode;

interface MenuItem
  extends FunctionComponent<{
    children: RenderChildren | ReturnType<RenderChildren>;
  }> {
  List: FunctionComponent<Pick<Parameters<RenderChildren>[0], "expand">>;
  Panel: FunctionComponent<Pick<Parameters<RenderChildren>[0], "expand">>;
  Main: FunctionComponent;
}

export default Menu;
