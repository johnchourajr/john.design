// add <strong> tag to words wrapped in asterisks

export const addStrongTags = (text: string) => {
  const words = text.split(" ");
  const wordsWithStrong = words.map((word, key) => {
    if (word.startsWith("*") && word.endsWith("*")) {
      return (
        <strong key={key} className="font-black-ritalic">
          {word.slice(1, -1)}
        </strong>
      );
    }
    return word;
  });
  return wordsWithStrong;
};
