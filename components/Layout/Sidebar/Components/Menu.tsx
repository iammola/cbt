import { FunctionComponent } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { DocumentReportIcon, HomeIcon } from "@heroicons/react/outline";

const Menu: FunctionComponent = () => {
    return (
        <nav className="flex-grow w-full px-5">
            <span className="inline-block text-gray-600 text-xs font-semibold uppercase tracking-wider pb-4">
                Menu
            </span>
            <ul className="flex flex-col gap-y-2 items-center justify-center w-full">
                <li className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 cursor-pointer">
                    <HomeIcon className="w-6 h-6 ml-3" />
                    <span className="text-sm">
                        Dashboard
                    </span>
                </li>
                <li className="flex gap-2.5 items-center justify-start w-full rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-2.5 pr-3 cursor-pointer">
                    <DocumentReportIcon className="w-6 h-6 ml-3" />
                    <span className="text-sm">
                        Exams
                    </span>
                    <ChevronDownIcon className="w-5 h-5 ml-auto text-gray-600" />
                </li>
            </ul>
        </nav>
    );
}

const MenuItem: MenuItem = ({ children }) => {
    const [expand, setExpand] = useState(false);
    const toggleExpand = () => setExpand(!expand);

    return typeof children === 'function' ? children({ expand, toggleExpand }) : children;
}

interface MenuItem extends FunctionComponent {
    List: FunctionComponent<{ expand: boolean; }>;
    Main: FunctionComponent<{ toggleExpand?: () => void }>;
}

export default Menu;
