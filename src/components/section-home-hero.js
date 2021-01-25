import React, { useState } from "react";
import styled from "styled-components";

import { Wrapper } from "../components/style/global-styles";
import Tick from "../components/tick";
import { stringToSlug } from "../functions/util";

export default function SectionHomeHero({ data }) {
	const [tickerSpeed, setTickerSpeed] = useState(15);
	const sectionHeroLength = data.section_hero.length - 1;

	return (
		<HomeSection>
			<Wrapper>
				<H2Left className="display">{data.section_hero[0]} </H2Left>
				<Tick
					onMouseEnter={() => setTickerSpeed(5)}
					onMouseLeave={() => setTickerSpeed(15)}
					tickerSpeed={tickerSpeed}
				>
					{() =>
						data.section_hero.map((item, i) => {
							if (i === 0 || i === sectionHeroLength) {
								return null;
							} else {
								return (
									<H2Center
										key={i}
										className="display"
										data-name={stringToSlug(item)}
									>
										{item}
										{" / "}
									</H2Center>
								);
							}
						})
					}
				</Tick>

				<H2Right className="display">
					{data.section_hero[sectionHeroLength]}
				</H2Right>
			</Wrapper>
		</HomeSection>
	);
}

const H2Left = styled.h2`
	text-align: left;
`;

const H2Right = styled.h2`
	text-align: right;
`;

const H2Center = styled.h2`
	text-align: center;
	white-space: pre;
`;

const HomeSection = styled.section`
	min-height: calc(60rem);
	height: calc(85vh - 8rem);
	display: flex;
	align-items: center;
`;
