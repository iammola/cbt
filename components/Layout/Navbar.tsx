import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { Transition } from "@headlessui/react";
import { FunctionComponent, useState } from "react";

import PFP from "/public/PFP.jpg";
import { Badges, Divide, UserImage } from "components/Misc";
import { BellIcon, CommentTextIcon, UsersIcon } from "components/Misc/Icons";

const Navbar: FunctionComponent = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [, , removeCookies] = useCookies(['account']);

    function logout() {
        removeCookies('account');
        setTimeout(router.push, 15e2, '/');
    }

    return (
        <header className="flex gap-4 items-center justify-between shadow-sm h-[6rem] w-full px-6 relative">
            <div className="flex gap-5 flex-grow items-center justify-end pl-10 h-full relative">
                <div className="p-3 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 cursor-pointer">
                    <CommentTextIcon className="w-5 h-5" />
                </div>
                <div className="p-3 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 cursor-pointer">
                    <BellIcon className="w-5 h-5" />
                </div>
                <div
                    onClick={() => setShow(!show)}
                    className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                >
                    <UserImage
                        src={PFP}
                        layout="fill"
                        objectFit="cover"
                        placeholder="blur"
                        objectPosition="center"
                        className="rounded-full"
                        initials={{
                            text: "AA",
                            className: "rounded-full bg-yellow-300"
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
                    className="absolute right-0 top-20 w-60 bg-white rounded-xl shadow-md px-5 py-6 origin-top-right transition-transform"
                >
                    <ul className="flex flex-col items-start justify-center gap-3">
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 font-medium p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <span className="w-max inline-block">
                                Profile settings
                            </span>
                            <Badges.Soon />
                        </li>
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 font-medium p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <span className="w-max inline-block">
                                View profile
                            </span>
                            <Badges.Soon />
                        </li>
                        <Divide className="w-full p-2" />
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 font-medium p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <UsersIcon className="w-5 h-5" />
                            <span className="w-max inline-block">
                                View students
                            </span>
                            <Badges.Soon />
                        </li>
                        <Divide className="w-full p-2" />
<<<<<<< HEAD
                        <li
                            onClick={logout}
                            className="flex gap-3 items-center justify-start text-xs text-gray-800 font-medium p-3 w-full rounded-md cursor-pointer hover:bg-gray-50"
                        >
=======
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
>>>>>>> parent of c60d099 (added `font-medium` style to menu)
                            <span className="w-max inline-block">
                                Log out
                            </span>
                        </li>
                    </ul>
                </Transition>
            </div>
        </header>
    )
}

export default Navbar;
