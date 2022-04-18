import { classNames } from "utils";

export const Section: React.FC<CP> = ({ children }) => {
  return <section className="w-full space-y-5">{children}</section>;
};

export const Title: React.FC<CP> = ({ children }) => {
  return <h4 className="font-serif text-4xl font-bold tracking-wide text-gray-700">{children}</h4>;
};

export const Cards: React.FC<CP> = ({ children }) => {
  return <ul className="relative flex w-full flex-wrap items-center justify-start gap-x-10 gap-y-6">{children}</ul>;
};

export const Card: React.FC<CP<{ className: string }>> = ({ children, className }) => {
  return (
    <li
      className={classNames(
        className,
        "flex w-[300px] flex-col items-start justify-start rounded-xl bg-white px-5 py-4 shadow"
      )}
    >
      {children}
    </li>
  );
};
