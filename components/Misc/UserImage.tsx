import Image from "next/image";
import { FunctionComponent, useState } from "react";

import { classNames } from "utils";

import type { UserImageProps } from "types";

const UserImage: FunctionComponent<UserImageProps> = ({
  initials,
  ...props
}) => {
  const [error, setError] = useState(false);

  return !error && props.src ? (
    <Image
      {...props}
      alt={props.alt ?? ""}
      onError={() => setError(true)}
      onLoadingComplete={() => setError(false)}
    />
  ) : (
    <span
      className={classNames(
        "flex h-full w-full items-center justify-center overflow-hidden font-medium text-white",
        initials.className,
        {
          "text-sm": initials.text.length < 3,
          "text-xs": initials.text.length > 2,
        }
      )}
    >
      {initials.text}
    </span>
  );
};

export default UserImage;
