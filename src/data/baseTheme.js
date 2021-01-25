const size = {
	mobileSm: "320px",
	mobile: "375px",
	mobileLg: "425px",
	tablet: "768px",
	laptop: "1024px",
	laptopLg: "1440px",
	desktop: "1920px",
	desktopLg: "2560px",
};

export const device = {
	mobileSm: `(min-width: ${size.mobileSm})`,
	mobile: `(min-width: ${size.mobile})`,
	mobileLg: `(min-width: ${size.mobileLg})`,
	tablet: `(min-width: ${size.tablet})`,
	laptop: `(min-width: ${size.laptop})`,
	laptopLg: `(min-width: ${size.laptopLg})`,
	desktop: `(min-width: ${size.desktop})`,
	desktopLg: `(min-width: ${size.desktopLg})`,
};

export const colors = {
	black: "#111111",
	gray1: "#333333",
	gray2: "#4F4F4F",
	gray3: "#828282",
	gray4: "#BDBDBD",
	gray5: "#E0E0E0",
	gray6: "#F2F2F2",
	white: "#ffffff",
};

export const animation = {
	timingFunction: {
		js: [0.1, 0.25, 0.3, 1],
		css: `cubic-bezier(0.1, 0.25, 0.3, 1)`,
	},
	duration: {
		100: {
			js: 0.3,
			css: `300ms`,
		},
		200: {
			js: 0.5,
			css: `500ms`,
		},
		300: {
			js: 0.6,
			css: `600ms`,
		},
	},
};
