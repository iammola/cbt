import { FunctionComponent } from "react";

export const Section: FunctionComponent = ({ children }) => {
  return <section className="w-full space-y-5">{children}</section>;
};

export const Title: FunctionComponent = ({ children }) => {
  return <h4 className="font-serif text-5xl font-bold tracking-wide text-gray-700">{children}</h4>;
};

export const Cards: FunctionComponent = ({ children }) => {
  return <ul className="flex flex-wrap w-full items-center justify-start gap-x-10 gap-y-6">{children}</ul>;
};

export const Card: FunctionComponent = ({ children }) => {
  return (
    <li className="flex h-64 w-[300px] flex-col items-start justify-between gap-y-5 rounded-xl bg-white px-5 py-4 shadow">
      {children}
    </li>
  );
};
