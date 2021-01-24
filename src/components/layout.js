import React from "react";
import Head from "./globals/head";
import Nav from "./globals/nav";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { device, colors, animation } from "../data/baseTheme";
import { PageWrapper } from "./style/global-styles";

export default function Layout({ children, pageTitle }) {
	return (
		<>
			<Head title={pageTitle} />
			<ThemeProvider
				theme={{ device: device, colors: colors, animation: animation }}
			>
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
