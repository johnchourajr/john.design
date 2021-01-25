import React from "react";
import { Wrapper } from "./style/global-styles";
import styled from "styled-components";

function commaSeparate(i, total) {
	if (i === total.length) {
		return ".";
	} else {
		return ", ";
	}
}

export default function SectionJobs({ brands }) {
	return (
		<Section className="pV">
			<h4>Brands Worked With</h4>
			<h1>
				{brands.map((item, i) => (
					<span key={i}>
						<Word href={item.url} target="_blank">
							{item.name}
						</Word>
						{commaSeparate(i + 1, brands)}
					</span>
				))}
			</h1>
		</Section>
	);
}

const Section = styled(Wrapper)`
	background-color: ${(props) => props.theme.colors.gray4};
	padding-top: 0 !important;
`;

const Word = styled.a`
	text-decoration: underline !important;
`;
