import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { generateCode } from "utils";

import type { NotificationProps } from "types";

type Item = Omit<NotificationProps, "remove" | "out">;

export type NotificationsHook = [
  (items: Item | Item[]) => number[],
  (idx: number) => void,
  JSX.Element
];

export function useNotifications(): NotificationsHook {
  const [notifications, setNotifications] = useState<
    (Item & Pick<NotificationProps, "out"> & { id: number })[]
  >([]);

  const addNotification: NotificationsHook[0] = (items) => {
    const newItems = [items]
      .flat()
      .map((item, i) => ({ ...item, id: generateCode() }));
    setNotifications((notifications) => [...notifications, ...newItems]);
    return newItems.map(({ id }) => id);
  };

  const removeNotification = (idx: number, ext: boolean = false) => {
    if (ext)
      setNotifications((notifications) =>
        notifications.map((item) =>
          item.id === idx ? { ...item, out: true } : item
        )
      );
    else
      setNotifications((notifications) =>
        notifications.filter(({ id }) => id !== idx)
      );
  };

  const Notifications: NotificationsHook[2] = (
    <aside className="pointer-events-none fixed inset-y-0 right-0 z-[1500] flex h-screen flex-col items-center justify-end gap-y-3 p-3 pb-8">
      {notifications.map(({ id, ...item }, i) => (
        <Notification key={id} {...item} remove={() => removeNotification(i)} />
      ))}
    </aside>
  );

  return [
    addNotification,
    (idx) => removeNotification(idx, true),
    Notifications,
  ];
}

const Notification: FunctionComponent<Omit<NotificationProps, "id">> = ({
  out,
  timeout,
  message,
  remove,
  Icon,
}) => {
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
      <div className="flex min-h-[4rem] w-96 items-center justify-start gap-6 rounded-lg border border-gray-200 bg-white p-4 pl-6 shadow-sm">
        <Icon />
        <p className="block grow truncate text-sm text-gray-900">{message}</p>
        <button
          onClick={closeNotification}
          className="pointer-events-auto rounded-md p-1 hover:bg-gray-200"
        >
          <XIcon className="h-5 w-5 fill-gray-500" />
        </button>
      </div>
    </Transition>
  );
};
