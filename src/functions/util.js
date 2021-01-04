export function clampBuilder(minFontSize, maxFontSize) {
	const root = document.querySelector("html");
	const pixelsPerRem = Number(getComputedStyle(root).fontSize.slice(0, -2));

	const minWidth = 375 / pixelsPerRem;
	const maxWidth = 1440 / pixelsPerRem;

	const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
	const yAxisIntersection = -minWidth * slope + minFontSize;

	return `clamp( ${minFontSize}rem, ${yAxisIntersection}rem + ${
		slope * 100
	}vw, ${maxFontSize}rem )`;
}
