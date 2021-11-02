import { FunctionComponent } from "react";

import PFP from "/public/PFP.jpg";
import { Divide, UserImage } from "components/Misc";
import { BellIcon, CommentTextIcon, UsersIcon } from "components/Misc/Icons";

const Navbar: FunctionComponent = () => {
    return (
        <header className="flex gap-4 items-center justify-between shadow-sm h-[6rem] w-full px-6 relative">
            <div className="flex gap-5 flex-grow items-center justify-end pl-10 h-full relative">
                <div className="p-3 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 cursor-pointer">
                    <CommentTextIcon className="w-5 h-5" />
                </div>
                <div className="p-3 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 cursor-pointer">
                    <BellIcon className="w-5 h-5" />
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer">
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
                <div className="absolute right-0 top-20 w-60 bg-white rounded-xl shadow-md px-5 py-6">
                    <ul className="flex flex-col items-start justify-center gap-3">
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <span className="w-max inline-block">
                                Profile settings
                            </span>
                        </li>
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <span className="w-max inline-block">
                                View profile
                            </span>
                        </li>
                        <Divide className="w-full p-2" />
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <UsersIcon className="w-5 h-5" />
                            <span className="w-max inline-block">
                                View students
                            </span>
                        </li>
                        <Divide className="w-full p-2" />
                        <li className="flex gap-3 items-center justify-start text-xs text-gray-500 p-3 w-full rounded-md cursor-pointer hover:bg-gray-50">
                            <span className="w-max inline-block">
                                Log out
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Navbar;
