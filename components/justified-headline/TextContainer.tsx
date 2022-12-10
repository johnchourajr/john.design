import { motion } from "framer-motion";
import clsx from "clsx";
import { slugify } from "../../utils";
import { addStrongTags } from "./utils";

export const TextContainer = ({
  text,
  motionObject,
  motionKey,
  letters,
  className,
}: any) => {
  if (!text) return null;

  const motionController = motionObject[motionKey];

  const renderText = () => {
    if (letters) {
      // split each letter in text into its own span
      const lettersArray = text.split("");
      return lettersArray.map((letter: any, index: number) => {
        return (
          <motion.span
            key={index}
            id={`${slugify(letter)}-${index}`}
            className={className}
            layout
          >
            {addStrongTags(letter)}
          </motion.span>
        );
      });
    } else {
      const childrenArray = typeof text === "string" ? text.split(" ") : [];
      return childrenArray.map((child: any, index: number) => {
        return (
          <motion.span
            key={index}
            id={`${slugify(child)}-${index}`}
            className={className}
            layout
          >
            {addStrongTags(child)} {index !== childrenArray.length - 1 && " "}
          </motion.span>
        );
      });
    }
  };

  return (
    <span
      className={clsx(
        "relative flex flex-col items-center justify-start w-full",
        motionController.parent
      )}
    >
      <motion.span
        className={clsx(
          "inline-flex whitespace-pre tracking-normal uppercase text-[8vw]",
          motionController.child
        )}
        layout
      >
        {renderText()}
      </motion.span>
    </span>
  );
};
