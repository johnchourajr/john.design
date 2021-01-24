export function clampBuilder(minFontSize, maxFontSize) {
	if (typeof document !== `undefined`) {
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
}

export function stringToSlug(str) {
	str = str.replace(/^\s+|\s+$/g, ""); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	var to = "aaaaeeeeiiiioooouuuunc------";
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
		.replace(/\s+/g, "-") // collapse whitespace and replace by -
		.replace(/-+/g, "-"); // collapse dashes

	return str;
}

export function repeatTitle(text) {
	const str = `${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} `;
	return str;
}
