import Image from "next/image";
import { FunctionComponent } from "react";

import { classNames } from "utils";

import type { BrandProps } from "types";

const Brand: FunctionComponent<BrandProps> = ({ open }) => {
  return (
    <div
      className={classNames("w-full flex gap-3 items-center", {
        "pl-5 pr-4 py-3 justify-start": open,
        "p-3 justify-center": open === false,
      })}
    >
      <div className="relative w-9 h-9 shrink-0">
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
          hidden: open === false,
        })}
      >
        Grand Regal School
      </span>
    </div>
  );
};

export default Brand;
