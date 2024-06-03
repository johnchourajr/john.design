import * as packageJSON from '../package.json';

type ColophonData = {
  title: string;
  description: string;
  summary: string;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  fontsCss: string;
};

export const colophonData: ColophonData = {
  title: 'Colophon',
  description: 'Site Technical Specs',
  summary: `This site is hand made by John Choura with Next.js, TypeScript, Tailwind CSS, and Framer Motion. For now, it's deployed and hosted with Netlify.`,
  dependencies: {
    ...packageJSON.dependencies,
  },
  devDependencies: {
    ...packageJSON.devDependencies,
  },
  fontsCss: `
@font-face {
  font-family: "KUniforma Bold";
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("../fonts/KUniforma-80Bold.woff2") format("woff2");
}

@font-face {
  font-family: "KUniforma Bold Ritalic";
  font-style: italic;
  font-weight: 850;
  font-display: swap;
  src: url("../fonts/KUniforma-85BoldRitalic.woff2") format("woff2");
}

@font-face {
  font-family: "KUniforma Black";
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url("../fonts/KUniforma-90Black.woff2") format("woff2");
}

@font-face {
  font-family: "KUniforma Black Ritalic";
  font-style: normal;
  font-weight: 950;
  font-display: swap;
  src: url("../fonts/KUniforma-95BlackRitalic.woff2") format("woff2");
}

@font-face {
  font-family: "PPMondwest";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url("../fonts/PPMondwest-Regular.woff2") format("woff2");
}

@font-face {
  font-family: "MontrealItalic";
  font-style: italic;
  font-weight: normal;
  font-display: swap;
  src: url("../fonts/OTNeueMontreal-BookItalicSemiSqueezed.woff2")
    format("woff2");
}

@font-face {
  font-family: "Montreal";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url("../fonts/OTNeueMontreal-BookSemiSqueezed.woff2") format("woff2");
}
  `,
};
