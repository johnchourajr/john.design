const PARENT_CLASSES = [
  "w-3/4",
  "w-3/4",
  "w-3/4",
  "w-3/4",
  "w-full",
  "w-full",
  "w-full",
  "w-full",
  "w-full",
  "w-full",
  "w-full",
  "w-full",
  "w-3/4 ml-auto",
  "w-3/4 ml-auto",
  "w-3/4 ml-auto",
  "w-3/4 ml-auto",
  "w-fit mr-auto",
  "w-fit mr-auto",
  "w-fit mr-auto",
  "w-fit mr-auto",
];
const CHILD_CLASSES = [
  "w-full justify-center",
  "w-full justify-center",
  "w-full justify-end",
  "w-full justify-end",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-between",
  "w-full justify-start",
  "w-full justify-start",
];

// randomize the generation of an parent and child classes
// for the justified headline
export function getRandomParentAndChildClasses() {
  const parent = Math.floor(Math.random() * PARENT_CLASSES.length);
  const child = Math.floor(Math.random() * CHILD_CLASSES.length);

  // prevent the same

  return {
    parent: PARENT_CLASSES[parent],
    child: CHILD_CLASSES[child],
  };
}
// create an of getRandomeParentAndChildClasses, choose the length of array
export function getRandomParentAndChildClassesArray(length: number = 4) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(getRandomParentAndChildClasses());
  }
  return arr;
}
