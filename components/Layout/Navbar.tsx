import { FunctionComponent } from "react";

import PFP from "/public/PFP.jpg";
import { BellIcon, CommentTextIcon } from "components/Misc/CustomIcons";
import { UserImage } from "components/Misc";

const Navbar: FunctionComponent = () => {
    return (
        <header className="flex gap-4 items-center justify-between shadow-sm h-[6rem] w-full px-6 relative">
            <div className="flex gap-5 flex-grow items-center justify-end pl-10 h-full">
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
            </div>
        </header>
    )
}

export default Navbar;
