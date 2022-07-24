import Image from "next/image";
const TranscriptFooter: React.FC<{ remark?: string; className: string }> = ({ className, remark }) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Principal&apos;s Remark:</span>
        <div className="text-lg font-bold uppercase tracking-wide text-slate-700">{remark}</div>
      </div>
      <div className="flex items-center justify-start gap-x-6">
        <span className="text-sm font-medium tracking-wide text-slate-600">Principal&apos;s Signature:</span>
        <div className="relative h-16 w-[166px] self-end">
          <Image
            priority
            layout="fill"
            alt="Principal Signature"
            objectFit="contain"
            src="/Principal Signature.png"
            objectPosition="center"
            className="brightness-50"
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptFooter;
