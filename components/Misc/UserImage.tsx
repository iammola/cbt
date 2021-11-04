import Image from 'next/image';
import { FunctionComponent, useState } from 'react';

import { classNames } from "utils";

import type { UserImageProps } from 'types';

const UserImage: FunctionComponent<UserImageProps> = ({ initials, ...props }) => {
    const [error, setError] = useState(false);

    return error === false ? (
        <Image
            {...props}
            alt={props.alt ?? ''}
            onError={() => setError(true)}
            onLoadingComplete={() => setError(false)}
        />
    ) : (
        <span
            className={classNames("flex items-center justify-center h-full w-full text-white font-medium overflow-hidden", initials.className, {
                "text-sm": initials.text.length < 3,
                "text-xs": initials.text.length > 2
            })}
        >
            {initials.text}
        </span>
    );
}

export default UserImage;
