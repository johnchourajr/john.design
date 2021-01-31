import { createGlobalStyle } from 'styled-components';
import { animation } from '../../data/baseTheme';

const homeHero = [
  {
    name: 'john-choura-is-a',
    styles: {
      foreground: 'white',
      background: ''
    }
  },
  {
    name: 'guy',
    styles: {
      foreground: '#E7C8D8',
      background: '#1659BE'
    }
  },
  {
    name: 'designer',
    styles: {
      foreground: '#FF0000',
      background: '#000000'
    }
  },
  {
    name: 'human',
    styles: {
      foreground: '#4965CA',
      background: '#FF8C8C'
    }
  },
  {
    name: 'developer',
    styles: {
      foreground: '#007305',
      background: '#00FF19'
    }
  },
  {
    name: 'artist',
    styles: {
      foreground: '#49CA84',
      background: '#1A3052'
    }
  },
  {
    name: 'craftsman',
    styles: {
      foreground: '#FFDB5E',
      background: '#992500'
    }
  },
  {
    name: 'infj',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'family-man',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'tinkerer',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'coffee-drinker',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'learner',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'you-still-reading-this',
    styles: {
      foreground: '#FF5C00',
      background: '#27AB64'
    }
  },
  {
    name: 'in-long-beach-calif',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  }
];

const homeJobs = [
  {
    name: 'job-godaddy',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'job-happy-money',
    styles: {
      foreground: 'red',
      background: 'black'
    }
  },
  {
    name: 'job-biola-art-dept',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'job-happy-money',
    styles: {
      foreground: 'red',
      background: 'black'
    }
  },
  {
    name: 'job-envoy',
    styles: {
      foreground: 'white',
      background: 'black'
    }
  },
  {
    name: 'job-biola-university-marketing',
    styles: {
      foreground: 'red',
      background: 'black'
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
}

body {
	transition:
		background-color ${animation.duration[200].css} ${animation.timingFunction.css},
		color ${animation.duration[200].css} ${animation.timingFunction.css};
	// transition-delay: ${animation.duration[100].css}
}

section, .section {
	transition:
			background-color ${animation.duration[200].css} ${animation.timingFunction.css};
	// transition-delay: ${animation.duration[100].css}
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
