import { createGlobalStyle } from 'styled-components';
import { animation } from '../../data/baseTheme';

const homeHero = [
  {
    name: 'guy',
    styles: {
      foreground: '#E7C8D8',
      background: '#E0E0E0',
      // image: '/hover-buddy/guy.png',
      figma_id: '253A16' // artist
    }
  },
  {
    name: 'designer',
    styles: {
      foreground: '#FF0000',
      background: '#E0E0E0',
      // image: '/hover-buddy/designer.png',
      figma_id: '253A71' // designer
    }
  },
  {
    name: 'human',
    styles: {
      foreground: '#4965CA',
      background: '#E0E0E0',
      // image: '/hover-buddy/human.png',
      figma_id: '253A24' // human
    }
  },
  {
    name: 'developer',
    styles: {
      foreground: '#007305',
      background: '#E0E0E0',
      // image: '/hover-buddy/dev.png',
      figma_id: '253A16' // artist
    }
  },
  {
    name: 'artist',
    styles: {
      foreground: '#49CA84',
      background: '#E0E0E0',
      // image: '/hover-buddy/artist.png',
      figma_id: '253A16' // artist
    }
  },
  {
    name: 'craftsman',
    styles: {
      foreground: '#FFDB5E',
      background: '#E0E0E0',
      // image: '/hover-buddy/craftsman.png',
      figma_id: '253A16' // artist
    }
  },
  {
    name: 'infj',
    styles: {
      foreground: 'white',
      background: '#E0E0E0',
      // image: '/hover-buddy/infj.png',
      figma_id: '253A16' // artist
    }
  },
  {
    name: 'family-man',
    styles: {
      foreground: 'white',
      background: '#E0E0E0',
      // image: '/hover-buddy/family-man.png',
      figma_id: '253A16' // artist
    }
  },
  {
    name: 'coffee-drinker',
    styles: {
      foreground: 'white',
      background: '#E0E0E0',
      // image: '/hover-buddy/coffee.png',
      figma_id: '253A16' // artist
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
