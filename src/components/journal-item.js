import React from "react";
import { Link } from "gatsby";

export default function JournalItem(props) {
	const cover = props.cover ? "Has Cover" : "No Cover";

	return (
		<Link style={{ marginBottom: "1em" }} to={props.slug}>
			<h2>{props.title}</h2>
			<h4>{props.date}</h4>
			<h4>{props.timeToRead} Minute Read</h4>
			<p>{props.excerpt}</p>
			<pre>{cover}</pre>
		</Link>
	);
}
