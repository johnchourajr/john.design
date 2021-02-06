import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { animation } from '../../data/baseTheme';
import { stringToSlug } from '../../functions/util';
import { useJournalData } from '../hooks/use-journal-data';
import { useHomepageData } from '../hooks/use-homepage-data';

/**
 * createThemeStyles function
 *
 * @param {Object} array
 * @param {String} option
 */
function createThemeStyles(array, option = '') {
  /**
   * Takes in an array of items
   */
  return array.map((item) => {
    /**
     * if the array is a journal post, we have to mutate the item query
     */
    if (option === 'journal') {
      item = item.node.frontmatter;
    }

    /**
     * Ternaries for the options
     */
    const foreground = item.foreground ? item.foreground : '#111111';
    const background = item.background ? item.background : '#E0E0E0';
    const cover = item.cover ? item.cover : '';
    const image = item.image ? item.image : cover;
    const slug = stringToSlug(item.title);

    /**
     * Generative return, this blob of styles is looped over for every object in the array
     */
    return `
body.theme--${slug} {
    background-color: ${background};
    color: ${foreground};
		transition:
			background-color ${animation.duration[200].css} ${animation.timingFunction.css},
			color ${animation.duration[200].css} ${animation.timingFunction.css};

    h1, h2, h3, h4, h5, h6, p, a, .nav > a {
			color: ${foreground};
      -webkit-text-stroke-color: ${foreground};
			text-decoration-color: ${foreground} !important;

			transition:
				color ${animation.duration[200].css} ${animation.timingFunction.css},
				text-decoration-color ${animation.duration[200].css} ${animation.timingFunction.css};
    }

    svg {
			fill: ${foreground};
			transition: fill ${animation.duration[200].css} ${animation.timingFunction.css}
    }

    section, .section {
      background-color: transparent;
			transition:
				background-color ${animation.duration[200].css} ${animation.timingFunction.css};
		}

		.hover-image {
			background-image: url(${image});
		}

		.shim {
			background-color: ${background};
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

/**
 * AnimationStyles Component
 * Exports all rendered styles
 */
export function AnimationStyles() {
  /**
   * Hooks
   */
  const { section_hero, section_resume } = useHomepageData();
  const journal_data = useJournalData();

  /**
   * Create global styles
   */
  const Styles = createGlobalStyle`
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

  ${createThemeStyles(section_hero)}
  ${createThemeStyles(section_resume)}
	${createThemeStyles(journal_data, 'journal')}
`;

  /**
   * Component is returned and consumed into the common layout
   */
  return <Styles />;
}
