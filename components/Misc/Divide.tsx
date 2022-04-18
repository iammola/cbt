import type { DivideProps } from "types";

const Divide: React.FC<DivideProps> = ({ className, HRclassName }) => {
  return (
    <div
      aria-hidden="true"
      className={className}
    >
      <hr className={HRclassName} />
    </div>
  );
};

export default Divide;
