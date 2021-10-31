import { ComponentProps, FunctionComponent } from "react";
const Notification: FunctionComponent<NotificationProps> = ({ timeout, message, Icon }) => {

    return (
        <></>
    );
}

type NotificationProps = {
    message: string;
    timeout: number;
    Icon(props: ComponentProps<'svg'>): void;
}

export default Notification;
