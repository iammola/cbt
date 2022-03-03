import { FunctionComponent } from "react";

import { classNames } from "utils";

const Badges: Badges = ({ className, text }) => {
  return (
    <span
      className={classNames(
        "inline-block rounded-full py-1 px-2.5 text-xs font-medium",
        className
      )}
    >
      {text}
    </span>
  );
};

Badges.Beta = function Beta() {
  return <Badges text="Beta" className="bg-indigo-50 text-indigo-800" />;
};

Badges.Soon = function Soon() {
  return <Badges text="Soon" className="bg-pink-50 text-pink-800" />;
};

Badges.New = function New() {
  return <Badges text="New" className="bg-blue-50 text-blue-800" />;
};

interface Badges
  extends FunctionComponent<{ className: string; text: string }> {
  Beta: FunctionComponent;
  Soon: FunctionComponent;
  New: FunctionComponent;
}

export default Badges;
