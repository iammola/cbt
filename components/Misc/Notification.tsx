import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { Fragment, FunctionComponent, useCallback, useEffect, useState } from "react";

import type { NotificationProps } from "types";

type Item = Omit<NotificationProps, "remove" | "out">;

export type NotificationsHook = [
    (items: Item | Item[]) => number[],
    (idx: number) => void,
    JSX.Element
];

export function useNotifications(): NotificationsHook {
    const [count, setCount] = useState(0);
    const [notifications, setNotifications] = useState<(Item & Pick<NotificationProps, 'out'> & { id: number; })[]>([]);

    const addNotification: NotificationsHook[0] = items => {
        let newCount = count;
        const newItems: (Item & { id: number; })[] = [items].flat().map((item, i) => ({ ...item, id: ++newCount }));
        setCount(newCount);
        setNotifications(notifications => [...notifications, ...newItems]);
        return newItems.map(({ id }) => id);
    }

    const removeNotification = (idx: number, ext: boolean = false) => {
        if (ext === true) setNotifications(notifications => notifications.map(item => item.id === idx ? { ...item, out: true } : item));
        else setNotifications(notifications => notifications.filter(({ id }) => id !== idx))
    };

    const Notifications: NotificationsHook[2] = (
        <aside className="flex flex-col items-center justify-end gap-y-3 p-3 pb-8 fixed right-0 inset-y-0 z-[1500] h-screen pointer-events-none">
            {notifications.map(({ id, ...item }, i) => (
                <Notification
                    key={id}
                    {...item}
                    remove={() => removeNotification(i)}
                />
            ))}
        </aside>
    );

    return [addNotification, idx => removeNotification(idx, true), Notifications];
}

const Notification: FunctionComponent<Omit<NotificationProps, 'id'>> = ({ out, timeout, message, remove, Icon }) => {
    const [show, setShow] = useState(true);

    const closeNotification = useCallback(() => setShow(false), []);

    useEffect(() => {
        const timer = setTimeout(closeNotification, timeout);
        return () => clearTimeout(timer);
    }, [closeNotification, timeout]);

    return (
        <Transition
            appear
            show={out === undefined ? show : !out}
            as={Fragment}
            afterLeave={remove}
            enter="ease-out duration-300 transition-transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200 transition-transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <div className="flex items-center justify-start gap-6 w-96 min-h-[4rem] p-4 pl-6 border border-gray-200 bg-white rounded-lg shadow-sm">
                <Icon />
                <p className="grow text-sm text-gray-900 block truncate">
                    {message}
                </p>
                <button
                    onClick={closeNotification}
                    className="p-1 rounded-md hover:bg-gray-200 pointer-events-auto"
                >
                    <XIcon className="w-5 h-5 fill-gray-500" />
                </button>
            </div>
        </Transition>
    );
}
