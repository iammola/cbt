import Image from "next/image";
import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { BrandProps } from "types";

const Brand: FunctionComponent<BrandProps> = ({ open }) => {
  return (
    <div
      className={classNames("flex w-full items-center gap-3", {
        "justify-start py-3 pl-5 pr-4": open,
        "justify-center p-3": !open,
      })}
    >
      <div className="relative h-9 w-9 shrink-0">
        <Image
          layout="fill"
          src="/Logo.png"
          alt="Brand Icon"
          objectFit="contain"
          objectPosition="center"
        />
      </div>
      <span
        className={classNames("tracking-wider", {
          hidden: open,
        })}
      >
        Grand Regal School
      </span>
    </div>
  );
};

export default Brand;
