import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { ComponentProps, Fragment, FunctionComponent, useState } from "react";

const Notification: FunctionComponent<NotificationProps> = ({ timeout, message, Icon }) => {
    const [show, setShow] = useState(true);

    return (
        <Transition
            appear
            show={show}
            as={Fragment}
            enter="ease-out duration-300 transition-transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200 transition-transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <div className="flex items-center justify-start gap-6 w-96 min-h-[4rem] p-4 pl-6 border border-gray-200 bg-white rounded-lg shadow-sm">
                <Icon />
                <p className="flex-grow text-sm text-gray-900 block truncate">
                    {message}
                </p>
                <button
                    onClick={closeNotification}
                    className="p-1 rounded-md hover:bg-gray-200 pointer-events-auto"
                >
                    <XIcon className="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </Transition>
    );
}

export type NotificationProps = {
    message: string;
    timeout: number;
    Icon(props: ComponentProps<'svg'>): JSX.Element;
}

export default Notification;
