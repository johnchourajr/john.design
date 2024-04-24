// to slug text

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
// function to set color on root based on selected color

export const setRootColor = (color: string) => {
  document.documentElement.style.setProperty("--root-color", color);
  // also set data attribute on root
  document.documentElement.setAttribute("data-color", color);
};
