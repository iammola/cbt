import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { Fragment, FunctionComponent, useEffect, useState } from "react";

import type { NotificationProps } from "types";

type Item = Omit<NotificationProps, "remove">;

type NotificationsHook = [
    (items: Item | Item[]) => void,
    (idx: number) => void,
    () => JSX.Element
];

export function useNotifications(): NotificationsHook {
    const [notifications, setNotifications] = useState<Item[]>([]);

    const addNotification: NotificationsHook[0] = items => setNotifications(notifications => [...notifications, ...[items].flat()]);

    const removeNotification: NotificationsHook[1] = idx => setNotifications(notifications => notifications.filter((_, i) => i !== idx));

    const Notifications: NotificationsHook[2] = () => (
        <aside className="flex flex-col items-center justify-end gap-y-3 p-3 pb-8 fixed right-0 inset-y-0 z-50 h-screen pointer-events-none">
            {notifications.map((item, i) => (
                <Item
                    key={i}
                    {...item}
                    remove={() => removeNotification(i)}
                />
            ))}
        </aside>
    );

    return [addNotification, removeNotification, Notifications];
}

const Item: FunctionComponent<NotificationProps> = ({ timeout, message, remove, Icon }) => {
    const [show, setShow] = useState(true);

    const timer = setTimeout(closeNotification, timeout);

    function closeNotification() {
        setShow(false);
        clearTimeout(timer);
    }

    return (
        <Transition
            appear
            show={show}
            as={Fragment}
            afterLeave={() => setTransitionEnd(true)}
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
