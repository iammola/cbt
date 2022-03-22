import { FunctionComponent, useMemo } from "react";

const EmptyPage: FunctionComponent<{ message: string }> = ({ message }) => {
  const emoji = useMemo(() => ["🫙", "🪫", "👌", "🗑"][Math.floor(Math.random() * 4)], []);

  return (
    <div className="absolute inset-0 z-[1000] flex h-full w-full flex-col items-center justify-center gap-y-3 backdrop-blur-sm">
      <span className="text-5xl">{emoji}</span>
      <span className="text-lg font-medium tracking-widest text-slate-700">{message}</span>
    </div>
  );
};

export default EmptyPage;
