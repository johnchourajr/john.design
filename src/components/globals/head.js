import React from "react";
import Helmet from "react-helmet";

function Head({ title }) {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content="Helmet application" />
		</Helmet>
	);
}

export default Head;
