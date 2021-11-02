import Image, { ImageProps } from 'next/image';
import { FunctionComponent, useState } from 'react';

import { classNames } from "utils";

    const [loadImage, setLoadImage] = useState(image !== undefined && image.length > 0);
const UserImage: FunctionComponent<UserImageProps> = ({ initials, ...props }) => {

    return loadImage === true ? (
        <Image
            layout="fill"
            alt={placeholder}
            src={image ?? ''}
            objectFit="cover"
            className={className}
            onError={() => setLoadImage(false)}
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
