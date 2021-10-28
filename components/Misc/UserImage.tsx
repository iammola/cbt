import Image from 'next/image';
import { FunctionComponent, useState } from 'react';

import { classNames } from "utils";

const UserImage: FunctionComponent<UserImageProps> = ({ image, placeholder, className }) => {
    const [loadImage, setLoadImage] = useState(image !== undefined && image.length > 0);

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

interface UserImageProps {
    image?: string;
    className?: string;
    placeholder: string;
}

export default UserImage;
