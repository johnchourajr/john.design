import { createGlobalStyle } from "styled-components";
import { animation } from "../../data/baseTheme";

/**
 * AnimationStyles Component
 * Exports all rendered styles
 */
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

  body.theme--change {
    background-color: var(--hover-background);
    color: var(--hover-foreground);
		transition:
			background-color ${animation.duration[200].css} ${animation.timingFunction.css},
			color ${animation.duration[200].css} ${animation.timingFunction.css};

    h1, h2, h3, h4, h5, h6, p, a, .nav > a {
			color: var(--hover-foreground) !important;
			text-decoration-color: var(--hover-foreground) !important;
			transition:
				color ${animation.duration[200].css} ${animation.timingFunction.css},
				text-decoration-color ${animation.duration[200].css} ${animation.timingFunction.css};
    }

		.text-outline {
			-webkit-text-stroke-color: var(--hover-foreground) !important;
		}

    svg {
			fill: var(--hover-foreground);
			transition: fill ${animation.duration[200].css} ${animation.timingFunction.css}
    }

    section, .section {
      background-color: transparent;
			transition:
				background-color ${animation.duration[200].css} ${animation.timingFunction.css};
		}

		.hover-image {
			background-image: var(--hover-image);
		}

		.shim {
			background-color: var(--hover-background);
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
