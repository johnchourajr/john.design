import React from "react";

export function Headline(props, { children, display, size, funky }) {
	return (
		<p
			className={size}
			data-display={display}
			data-funky={funky}
			{...props}
		>
			{children}
		</p>
	);
}

export function Paragraph(props, { children }) {
	return <p {...props}>{children}</p>;
}

export function Caption(props, { children }) {
	return (
		<p className="caption" {...props}>
			{children}
		</p>
	);
}
