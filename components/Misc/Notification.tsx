import { Transition } from "@headlessui/react";
import { ComponentProps, Fragment, FunctionComponent } from "react";

const Notification: FunctionComponent<NotificationProps> = ({ timeout, message, Icon }) => {

    return (
        <Transition
            appear
            show
            as={Fragment}
            enter="ease-out duration-300 transition-transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200 transition-transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        ></Transition>
    );
}

type NotificationProps = {
    message: string;
    timeout: number;
    Icon(props: ComponentProps<'svg'>): JSX.Element;
}

export default Notification;
