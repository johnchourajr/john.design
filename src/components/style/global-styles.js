import styled from "styled-components";
// import { clampBuilder } from "../../functions/util";

export function clampBuilder(minFontSize, maxFontSize) {
	// const root = document.querySelector("html");
	// const pixelsPerRem = Number(getComputedStyle(root).fontSize.slice(0, -2));

	// console.log({ root, pixelsPerRem });

	const pixelsPerRem = 16;
	const minWidth = 375 / pixelsPerRem;
	const maxWidth = 1440 / pixelsPerRem;

	const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
	const yAxisIntersection = -minWidth * slope + minFontSize;

	return `clamp( ${minFontSize}rem, ${yAxisIntersection}rem + ${
		slope * 100
	}vw, ${maxFontSize}rem )`;
}

export const PageWrapper = styled.div`
	@font-face {
		font-family: "LabilGrotesk-Medium";
		font-weight: 600;
		src: url("/fonts/LabilGrotesk-Medium.otf") format("otf"),
			url("/fonts/LabilGrotesk-Medium.woff") format("woff"),
			url("/fonts/LabilGrotesk-Medium.woff2") format("woff2");
		font-weight: normal;
		font-style: normal;
	}

	margin: 0 auto;
	width: 100vw;
	overflow-x: hidden;
	color: ${(props) => props.theme.colors.black};
	font-family: "LabilGrotesk-Medium", sans-serif;
	font-style: normal;
	font-weight: 500;

	a {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	pre {
		font-family: monospace;
		margin: 1rem 0;
	}

	h1,
	.h1,
	h2,
	.h2,
	h3,
	.h3,
	h4,
	.h4,
	h5,
	.h5,
	h6,
	.h6,
	p,
	.p {
		margin-top: 0;
		margin-bottom: 1rem;

		&-funky,
		&.funky,
		&[data-funky] {
			font-feature-settings: "ss02" on, "ss05" on, "salt" on, "ss01" on !important;
		}
	}

	h1,
	.h1 {
		font-size: ${clampBuilder(2.5, 3.25)};
		line-height: 132%;
		letter-spacing: -0.01em;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;

		&-display,
		&.display,
		&[data-display] {
			font-size: ${clampBuilder(4.5, 12.5)};
			line-height: 100%;
		}
	}

	h2,
	.h2 {
		font-size: ${clampBuilder(2, 2.5)};
		line-height: 125%;
		letter-spacing: -0.01em;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;

		&-display,
		&.display,
		&[data-display] {
			font-size: ${clampBuilder(2.5, 8.25)};
			line-height: 100%;
		}
	}

	h3,
	.h3 {
		font-size: ${clampBuilder(1.5, 2)};
		line-height: 120%;
		letter-spacing: -0.01em;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;

		&-display,
		&.display,
		&[data-display] {
			font-size: ${clampBuilder(2.5, 6.25)};
			line-height: 100%;
		}
	}

	h4,
	.h4 {
		font-size: ${clampBuilder(1, 1.25)};
		line-height: 120%;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;
	}

	h5,
	.h5 {
		font-size: ${clampBuilder(0.8125, 1)};
		line-height: 120%;
		letter-spacing: 0.105em;
		text-transform: uppercase;
		font-feature-settings: "ss02" on, "ss05" on, "cpsp" on, "calt" off,
			"liga" off;
	}

	p,
	.p {
		font-size: 16px;
		line-height: 200%;
		font-feature-settings: "ss05" on, "ss03" on, "ss07" on, "calt" off,
			"liga" off;
	}

	p.lead,
	.p-lead {
		font-size: 24px;
		line-height: 200%;
		font-feature-settings: "ss05" on, "ss03" on, "ss07" on, "calt" off,
			"liga" off;
	}

	p.caption,
	.p-caption {
		font-size: 11px;
		line-height: 170%;
		letter-spacing: 0.01em;
		font-feature-settings: "ss05" on, "ss03" on, "ss07" on, "calt" off,
			"liga" off;
	}

	a {
		color: ${(props) => props.theme.colors.black};
		transition: color ${(props) => props.theme.animation.duration[100].css}
			${(props) => props.theme.animation.timingFunction.css};
		text-decoration-thickness: 0;
		opacity: 1;

		&:hover {
			color: ${(props) => props.theme.colors.gray1};
			text-decoration-skip-ink: auto;
			text-decoration-thickness: 0.065em;
		}
	}

	.no-underline,
	a:hover > .no-underline {
		text-decoration: none !important;
	}
`;

export const Wrapper = styled.div`
	padding: 0 1rem;
	width: calc(100vw - 2rem);

	@media ${(props) => props.theme.device.tablet} {
		padding: 0 7vw;
		width: 86vw;
	}

	&.pV {
		padding-top: 7vw;
		padding-bottom: 7vw;
	}
`;
