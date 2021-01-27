import React, { useState } from "react";
import styled from "styled-components";

import { Wrapper } from "../components/style/global-styles";
import Tick from "../components/tick";
import { stringToSlug, changeBodyClass } from "../functions/util";
import { SuperStateContext } from "./layout";

function TickerText({ item, slug }) {
	return (
		<SuperStateContext.Consumer>
			{(context) => {
				return (
					<H2Center
						className="display"
						data-name={slug}
						onMouseEnter={() => changeBodyClass("enter", slug)}
						onMouseLeave={() => changeBodyClass("exit", slug)}
					>
						{item}
						<span>{" / "}</span>
					</H2Center>
				);
			}}
		</SuperStateContext.Consumer>
	);
}

export default function SectionHomeHero({ data }) {
	const [tickerSpeed, setTickerSpeed] = useState(15);
	const sectionHeroLength = data.section_hero.length - 1;

	// console.log(data.section_hero.map((item) => stringToSlug(item)));

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
							const slug = stringToSlug(item);
							if (i === 0 || i === sectionHeroLength) {
								return null;
							} else {
								return <TickerText key={i} slug={slug} item={item} />;
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
