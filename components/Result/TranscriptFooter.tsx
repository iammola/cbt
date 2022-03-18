import Image from "next/image";
import { format } from "date-fns";
import { FunctionComponent } from "react";

const TranscriptFooter: FunctionComponent = () => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Principal Remark:</span>
        <div className="tracking-wide text-slate-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, commodi!
        </div>
      </div>
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Principal Signature:</span>
        <div className="relative h-16 w-[166px] self-end">
          <Image
            priority
            layout="fill"
            alt="VP Signature"
            objectFit="contain"
            src="/Signature VP.png"
            objectPosition="center"
            className="brightness-50"
          />
        </div>
      </div>
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Date:</span>
        <div className="border-b-2 border-dotted border-slate-500 px-6 py-2 text-xl tracking-wide text-slate-600">
          {format(new Date(), "dd-MM-yyyy")}
        </div>
      </div>
    </div>
  );
};

export default TranscriptFooter;
