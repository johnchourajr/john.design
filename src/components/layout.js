import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import Head from "./globals/head";

const pageStyles = {
	color: "#232129",
	fontFamily: "-apple-system, Roboto, sans-serif, serif",
	margin: `0 auto`,
	maxWidth: 650,
	padding: `0 1rem`,
};

export default function Layout({ children, pageTitle }) {
	return (
		<>
			<Head />
			<div style={pageStyles}>
				<Helmet>
					<title>{pageTitle}</title>
					<meta name="description" content="Helmet application" />
				</Helmet>
				<div>John.Design</div>
				<div>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/work">Work</Link>
						</li>
						<li>
							<Link to="/journal">Journal</Link>
						</li>
					</ul>
				</div>
				{children}
			</div>
		</>
	);
}
