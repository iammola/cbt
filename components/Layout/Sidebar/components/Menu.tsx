import Link from "next/link";
import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useCookies } from "react-cookie";
import { Fragment, useMemo, useState } from "react";
import { DesktopComputerIcon, DocumentTextIcon } from "@heroicons/react/outline";

import { classNames } from "utils";
import { CalendarIcon, HomeIcon, FileTextIcon } from "components/Misc/Icons";

import type { MenuProps } from "types";
import type { LoginData } from "types/api";

const Menu: React.FC<MenuProps> = ({ open }) => {
  const [{ account }] = useCookies<"account", { account?: LoginData }>(["account"]);

  const nav = useMemo<MenuNavItem[]>(() => {
    const access = account?.access;

    if (!access || access == "Student") return [];

    const general = [
      { main: { url: "/home/", title: "Dashboard", Icon: HomeIcon } },
      { main: { url: "/calendar/", title: "Calendar", Icon: CalendarIcon } },
    ];

    const nav = {
      Teacher: [
        {
          main: { title: "Exams", Icon: FileTextIcon },
          sub: [
            { title: "View Exams", url: "/exams/" },
            { title: "Create an Exam", url: "/exams/create/" },
          ],
        },
        {
          main: { title: "Results", Icon: DesktopComputerIcon },
          sub: [
            { title: "View CBT Results", url: "/results/cbt/" },
            { title: "Upload Term Comments", url: "/results/comments/" },
            { title: "Upload Term Result", url: "/results/create/" },
            { title: "View Term Results", url: "/results/picker/" },
            { title: "View Transcript", url: "/results/picker/transcript/" },
            { title: "Check Results Status", url: "/results/check-status/" },
          ],
        },
        {
          main: { title: "Registration Forms", Icon: DocumentTextIcon },
          sub: [
            { title: "Register an Event", url: "/events/create/" },
            { title: "Register a Student", url: "/students/create/" },
          ],
        },
      ],
      GroupedUser: [
        {
          main: { title: "Exams", Icon: FileTextIcon },
          sub: [{ title: "Create an Exam", url: "/exams/create/" }],
        },
      ],
    }[access];

    return [...nav, ...general];
  }, [account?.access]);

  return (
    <nav className={classNames("w-full grow", { "px-5": open, "px-1 sm:px-4": !open })}>
      <span
        className={classNames(
          "inline-block w-full pb-4 text-[0.6rem] font-semibold uppercase tracking-wider text-gray-400",
          { "text-center": !open }
        )}
      >
        Menu
      </span>
      <ul className="flex w-full flex-col items-center justify-center gap-y-2">
        {nav.map(({ main: { Icon, title, url }, sub }) => {
          const Elem = (
            <Fragment>
              <Icon className={classNames("h-6 w-6 shrink-0", { "ml-3": open })} />
              <span className={classNames("truncate text-sm", { hidden: !open, block: open })}>{title}</span>
              {url == undefined && (
                <ChevronDownIcon className={classNames("ml-auto h-5 w-5 shrink-0 text-gray-600", { hidden: !open })} />
              )}
            </Fragment>
          );

          return (
            <MenuItem key={title}>
              {({ expand, toggleExpand }) => {
                const classes = classNames(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                  { "justify-start pr-3": open, "justify-center": !open, "sm:py-3": !open && !url }
                );

                const list = sub?.map(({ title, url }) => (
                  <li
                    key={title}
                    className="w-full"
                  >
                    <Link href={url}>
                      <a className="mt-2 flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg py-2.5 pr-3 pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        <span className="block truncate text-sm">Create an Exam</span>
                      </a>
                    </Link>
                  </li>
                ));

                return (
                  <Fragment>
                    <MenuItem.Main>
                      {url ? (
                        <Link
                          href={url}
                          className={classes}
                        >
                          {Elem}
                        </Link>
                      ) : (
                        <div
                          className={classes}
                          onClick={toggleExpand}
                        >
                          {Elem}
                          <ChevronDownIcon
                            className={classNames("ml-auto h-5 w-5 shrink-0 text-gray-600", { hidden: !open })}
                          />
                        </div>
                      )}
                    </MenuItem.Main>
                    {open ? (
                      <MenuItem.List expand={expand}>{list}</MenuItem.List>
                    ) : (
                      <MenuItem.Panel expand={expand}>{list}</MenuItem.Panel>
                    )}
                  </Fragment>
                );
              }}
            </MenuItem>
          );
        })}
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
  return <Fragment>{children}</Fragment>;
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

type RenderChildren = (o: { expand: boolean; toggleExpand(): void }) => React.ReactNode;

interface MenuItem
  extends React.FC<{
    children: RenderChildren | ReturnType<RenderChildren>;
  }> {
  List: React.FC<CP<Pick<Parameters<RenderChildren>[0], "expand">>>;
  Panel: React.FC<CP<Pick<Parameters<RenderChildren>[0], "expand">>>;
  Main: React.FC<CP>;
}

type MenuNavItem = {
  main: {
    url?: string;
    title: string;
    Icon: React.FC<React.ComponentProps<"svg">>;
  };
  sub?: {
    title: string;
    url: string;
  }[];
};

export default Menu;
