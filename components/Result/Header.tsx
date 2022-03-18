import Image from "next/image";
import type { FunctionComponent } from "react";

const Header: FunctionComponent = () => {
  return (
    <div className="flex w-full items-center justify-center gap-10">
      <figure className="relative h-24 w-24">
        <Image
          priority
          layout="fill"
          alt="GRS Logo"
          src="/Logo.png"
          objectFit="contain"
          objectPosition="center"
        />
      </figure>
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="min-w-max text-3xl font-extrabold uppercase tracking-wider text-gray-700">
          Grand Regal International School
        </h2>
        <p className="pb-2 text-sm text-gray-700">Path to Peak for Excellence</p>
        <p className="text-xs font-medium text-gray-600">Hse. 2, 2nd Avenue, Wole Soyinka Drive, Gwarinpa, Abuja</p>
      </div>
    </div>
  );
};

export default Header;
