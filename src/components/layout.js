import React from "react";
import Head from "./globals/head";
import Nav from "./globals/nav";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { clampBuilder } from "../functions/util";
import { device, colors } from "../data/baseTheme";

export default function Layout({ children, pageTitle }) {
	return (
		<>
			<Head title={pageTitle} />
			<ThemeProvider theme={{ device: device, colors: colors }}>
				<BodyStyles />
				<ResetStyles />
				<PageWrapper>
					<Nav />
					{children}
				</PageWrapper>
			</ThemeProvider>
		</>
	);
}

const PageWrapper = styled.div`
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

	@media ${(props) => props.theme.device.tablet} {
	}

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
		line-height: 140%;
		letter-spacing: -0.01em;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;

		@media ${(props) => props.theme.device.laptopLg} {
			line-height: 140%;
		}

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
		line-height: 130%;
		letter-spacing: -0.01em;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;

		&-display,
		&.display,
		&[data-display] {
			font-size: ${clampBuilder(3.5, 6.25)};
			line-height: 100%;
		}
	}

	h3,
	.h3 {
		font-size: ${clampBuilder(1.5, 2)};
		line-height: 120%;
		letter-spacing: -0.01em;
		font-feature-settings: "ss02" on, "ss05" on, "calt" off, "liga" off;
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
`;

export const BodyStyles = createGlobalStyle`
    body {
        background-color: ${(props) => props.theme.colors.gray5};
        color: ${(props) => props.theme.colors.black};
        font-family: "LabilGrotesk-Medium", sans-serif;
        font-style: normal;
		font-weight: 500;
    }
`;

export const ResetStyles = createGlobalStyle`
    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section {
        display: block;
    }
    body {
        padding: 0;
        margin: 0;
    }
    ol,
    ul {
        list-style: none;
    }
    blockquote,
    q {
        quotes: none;
    }
    blockquote:before,
    blockquote:after,
    q:before,
    q:after {
        content: "";
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
`;
