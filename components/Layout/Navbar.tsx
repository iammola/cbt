import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { Transition } from "@headlessui/react";
import { FunctionComponent, useState } from "react";

import { Badges, Divide, UserImage } from "components/Misc";
import { BellIcon, CommentTextIcon, UsersIcon } from "components/Misc/Icons";

const Navbar: FunctionComponent = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [{ account }, , removeCookies] = useCookies(["account", "exam", "timeBounds"]);

  function logout() {
    removeCookies("exam", { path: "/" });
    removeCookies("account", { path: "/" });
    removeCookies("timeBounds", { path: "/" });
    setTimeout(router.push, 5e2, "/");
  }

  return (
    <header className="relative flex h-[6rem] w-full items-center justify-between gap-4 bg-white px-6 shadow-sm">
      <div className="relative flex h-full grow items-center justify-end gap-5 pl-10">
        <div className="cursor-pointer rounded-full p-3 hover:bg-gray-50">
          <CommentTextIcon className="h-5 w-5 fill-gray-600 hover:fill-gray-800" />
        </div>
        <div className="cursor-pointer rounded-full p-3 hover:bg-gray-50">
          <BellIcon className="h-5 w-5 fill-gray-600 hover:fill-gray-800" />
        </div>
        <div
          onClick={() => setShow(!show)}
          className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full"
        >
          <UserImage
            src={account?.image ?? "https://source.unsplash.com/featured/?random"}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-full"
            initials={{
              text: account?.name.initials ?? "",
              className: "rounded-full bg-amber-300",
            }}
          />
        </div>
        <Transition
          appear
          show={show}
          enter="ease-out"
          enterFrom="scale-0"
          enterTo="scale-100"
          leave="ease-in"
          leaveFrom="scale-100"
          leaveTo="scale-0"
          className="absolute right-0 top-20 w-60 origin-top-right rounded-xl bg-white px-5 py-6 shadow-md transition-transform"
        >
          <ul className="flex flex-col items-start justify-center gap-3">
            <li className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-md p-3 text-xs font-medium text-gray-500 hover:bg-gray-50">
              <span className="inline-block w-max">Profile settings</span>
              <Badges.Soon />
            </li>
            <li className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-md p-3 text-xs font-medium text-gray-500 hover:bg-gray-50">
              <span className="inline-block w-max">View profile</span>
              <Badges.Soon />
            </li>
            <Divide className="w-full p-2" />
            <li className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-md p-3 text-xs font-medium hover:bg-gray-50">
              <UsersIcon className="h-5 w-5 text-gray-500" />
              <span className="inline-block w-max">View students</span>
              <Badges.Soon />
            </li>
            <li className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-md p-3 text-xs font-medium hover:bg-gray-50">
              <BellIcon className="h-5 w-5 text-gray-500" />
              <span className="inline-block w-max">Notifications</span>
              <Badges.Soon />
            </li>
            <li className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-md p-3 text-xs font-medium hover:bg-gray-50">
              <CommentTextIcon className="h-5 w-5 text-gray-500" />
              <span className="inline-block w-max">Messages</span>
              <Badges.Soon />
            </li>
            <Divide className="w-full p-2" />
            <li
              onClick={logout}
              className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-md p-3 text-xs font-medium text-gray-800 hover:bg-gray-50"
            >
              <span className="inline-block w-max">Log out</span>
            </li>
          </ul>
        </Transition>
      </div>
    </header>
  );
};

export default Navbar;
