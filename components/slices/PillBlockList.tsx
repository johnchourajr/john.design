import { motion } from "framer-motion";
import { Typography } from "@/components/Typography";
import clsx from "clsx";
import { SectionStructure } from "@/types/content-types";

export type PillBlockListProps = SectionStructure & {};

export function PillBlockList({ list }: PillBlockListProps) {
  if (!list) {
    return null;
  }
  return (
    <>
      <section className={clsx("relative z-20 ")}>
        <div className={clsx("flex flex-wrap items-center justify-center")}>
          {list.map((item, index) => (
            <motion.div
              key={index}
              className={clsx(
                "relative px-8 py-6",
                "before:content-[''] before:absolute before:-inset-[1px] before:border-2 before:border-root before:rounded-full "
              )}
            >
              <p className="headline-display-sm">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
