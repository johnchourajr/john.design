import React from "react";

const pageStyles = {
	color: "#232129",
	fontFamily: "-apple-system, Roboto, sans-serif, serif",
	margin: `0 auto`,
	maxWidth: 650,
	padding: `0 1rem`,
};

export default function Layout({ children }) {
	return (
		<div style={pageStyles}>
			<div>Nav</div>
			{children}
		</div>
	);
}
