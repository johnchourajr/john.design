import React from "react";
import Helmet from "react-helmet";

function Head(props) {
	return (
		<Helmet>
			<title>{props.title}</title>
			<meta name="description" content="Helmet application" />
		</Helmet>
	);
}

export default Head;
