import Image, { ImageProps } from 'next/image';
import { FunctionComponent, useState } from 'react';

import { classNames } from "utils";

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
        <span className={classNames("flex items-center justify-center h-full w-full text-white font-medium overflow-hidden", className, {
            "text-sm": placeholder.length === 2,
            "text-xs": placeholder.length > 2
        })}>
            {placeholder}
        </span>
    );
}

type UserImageProps = ImageProps & {
    initials: {
        text: string;
        className?: string;
    }
}

export default UserImage;
