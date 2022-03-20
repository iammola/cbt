import Image from "next/image";
import { FunctionComponent } from "react";

const TranscriptFooter: FunctionComponent<{ className: string }> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Principal&apos;s Remark:</span>
        <div className="tracking-wide text-slate-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, commodi!
        </div>
      </div>
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Principal&apos;s Signature:</span>
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
    </div>
  );
};

export default TranscriptFooter;
