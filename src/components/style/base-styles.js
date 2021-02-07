import { createGlobalStyle } from 'styled-components';
import { animation, colors } from '../../data/baseTheme';

export const BodyStyles = createGlobalStyle`
    html {
      scroll-behavior: smooth;
      font-size: 16px;
    }

    body {
        background-color: ${colors.gray5};
        color: ${colors.black};
        font-family: "LabilGrotesk-Medium", sans-serif;
        font-style: normal;
        font-weight: 500;
    }

    * {
        box-sizing: border-box;
        transition-timing-function: ${animation.timingFunction.css};
    }

    body[data-hover=true] {
      .hover-image {
        visibility: visible;
        opacity: 1;
      }
    }

    body[data-iframe=true] {
      .hover-iframe {
        visibility: visible;
        opacity: 1;
      }
    }

    body.theme--artist,
    body.theme--infj {
        .indefinite-article-a {
            display: none;
        }
        .indefinite-article-an {
            display: inline-block;
        }
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
