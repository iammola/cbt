import Image from "next/image";
import { FunctionComponent } from "react";

import BrandIcon from "/public/favicon.ico"

const Brand: FunctionComponent = () => {
    return (
        <div className="w-full pl-5 pr-4 py-3 flex gap-3 items-center justify-start">
            <div className="relative w-9 h-9">
                <Image
                    layout="fill"
                    src={BrandIcon}
                    alt="Brand Icon"
                    objectFit="cover"
                />
            </div>
            <span className="text-sm font-bold tracking-tight">
                Grand Regal School
            </span>
        </div>
    );
}

export default Brand;
