import { createGlobalStyle } from 'styled-components';
import { animation } from '../../data/baseTheme';

const homeHero = [
  {
    name: 'guy',
    styles: {
      foreground: '#FF5631',
      background: '#E0E0E0'
    }
  },
  {
    name: 'designer',
    styles: {
      foreground: '#2861FF',
      background: '#E0E0E0'
    }
  },
  {
    name: 'human',
    styles: {
      foreground: '#FF1D1D',
      background: '#E0E0E0'
    }
  },
  {
    name: 'developer',
    styles: {
      foreground: '#00CB39',
      background: '#E0E0E0'
    }
  },
  {
    name: 'artist',
    styles: {
      foreground: '#EF36FF',
      background: '#E0E0E0'
    }
  },
  {
    name: 'craftsman',
    styles: {
      foreground: '#42D7BC',
      background: '#E0E0E0'
    }
  },
  {
    name: 'infj',
    styles: {
      foreground: '#FF5631',
      background: '#E0E0E0'
    }
  },
  {
    name: 'family-man',
    styles: {
      foreground: '#2861FF',
      background: '#E0E0E0'
    }
  },
  {
    name: 'coffee-drinker',
    styles: {
      foreground: '#FF1D1D',
      background: '#E0E0E0'
    }
  }
];

const homeJobs = [
  {
    name: 'job-godaddy',
    styles: {
      foreground: '#111111',
      background: '#1BDBDB',
      image: '/hover-buddy/gd.png'
    }
  },
  {
    name: 'job-happy-money',
    styles: {
      foreground: '#111111',
      background: '#F65996',
      image: '/hover-buddy/hm.png'
    }
  },
  {
    name: 'job-biola-art-dept',
    styles: {
      foreground: '#111111',
      background: '#EA0E2E',
      image: '/hover-buddy/bu.png'
    }
  },
  {
    name: 'job-happy-money',
    styles: {
      foreground: '#111111',
      background: '#F65996',
      image: '/hover-buddy/hm.png'
    }
  },
  {
    name: 'job-envoy',
    styles: {
      foreground: '#111111',
      background: '#CECECE',
      image: '/hover-buddy/e.png'
    }
  },
  {
    name: 'job-biola-university-marketing',
    styles: {
      foreground: '#111111',
      background: '#EA0E2E',
      image: '/hover-buddy/bu.png'
    }
  }
];

function createThemeStyles(array) {
  return array.map((item) => {
    return `
body.theme--${item.name} {
    background-color: ${item.styles.background};
    color: ${item.styles.foreground};
	transition:
		background-color ${animation.duration[200].css} ${animation.timingFunction.css},
		color ${animation.duration[200].css} ${animation.timingFunction.css};

    h1, h2, h3, h4, h5, h6, p, a, .nav > a {
				color: ${item.styles.foreground} !important;
				text-decoration-color: ${item.styles.foreground} !important;
				transition:
					color ${animation.duration[200].css} ${animation.timingFunction.css},
					text-decoration-color ${animation.duration[200].css} ${animation.timingFunction.css};
    }

    svg {
		fill: ${item.styles.foreground};
		transition: fill ${animation.duration[200].css} ${animation.timingFunction.css}
    }

    section, .section {
        background-color: transparent;
		transition:
			background-color ${animation.duration[200].css} ${animation.timingFunction.css};
		}

		.hover-image {
			background-image: url(${item.styles.image});
		}

		.shim {
			background-color: ${item.styles.background};
			transition:
				background-color ${animation.duration[200].css} ${animation.timingFunction.css};
		}
}

body {
	transition:
		background-color ${animation.duration[200].css} ${animation.timingFunction.css},
		color ${animation.duration[200].css} ${animation.timingFunction.css};
}

section, .section {
	transition:
			background-color ${animation.duration[200].css} ${animation.timingFunction.css};
}
        `;
  });
}

export const AnimationStyles = createGlobalStyle`
    body {
        transition:
			background-color ${animation.duration[200].css} ${animation.timingFunction.css},
			color ${animation.duration[200].css} ${animation.timingFunction.css};
		will-change: background-color, color;

		h1, h2, h3, h4, h5, h6, p, a, .nav > a {
			transition:
				color ${animation.duration[200].css} ${animation.timingFunction.css};
			will-change: color;
		}

		svg {
			transition:
				fill ${animation.duration[200].css} ${animation.timingFunction.css};
			will-change: fill;
		}

		section {
			transition:
				background-color ${animation.duration[200].css} ${animation.timingFunction.css};
			will-change: background-color;
		}

	}

    ${createThemeStyles(homeHero)}
		${createThemeStyles(homeJobs)}
`;
