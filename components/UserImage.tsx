import Image from 'next/image';
import { FunctionComponent, useState } from 'react';

import { classNames } from "utils";

const UserImage: FunctionComponent<UserImageProps> = ({ image, placeholder, className }) => {
    const [loadImage, setLoadImage] = useState(image !== undefined && image.length > 0);

    return loadImage === true ? (
        <Image
            layout="fill"
            src={image ?? ''}
            alt={placeholder}
            onError={() => setLoadImage(false)}
            className={classNames("object-cover", className)}
        />
    ) : (
        <span className={classNames("flex items-center justify-center h-full w-full text-white text-sm font-medium overflow-hidden", className)}>
            {placeholder.slice(0, 2).toUpperCase()}
        </span>
    );
}

interface UserImageProps {
    image?: string;
    className?: string;
    placeholder: string;
}

export default UserImage;
