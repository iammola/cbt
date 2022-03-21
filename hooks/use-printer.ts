import { jsPDF } from "jspdf";
import { useRef } from "react";

export const usePrinter = () => {
  const ref = useRef<HTMLElement>(null);

  return {
    ref,
    print() {
      if (!ref.current) return;
      const { width, height } = ref.current.getBoundingClientRect();
      new jsPDF({ unit: "px", format: [width, height] }).html(ref.current, {
        image: { quality: 100, type: "png" },
        callback(doc) {
          doc.save();
        },
      });
    },
  };
};
