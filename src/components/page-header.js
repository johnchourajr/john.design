import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Wrapper } from "../components/style/global-styles";
import Tick from "../components/tick";

const rotations = ["-6.69deg", "-12.78deg", "-33.78deg", "17.51deg"];

export default function PageHeader(props) {
	const [rotation, setRotation] = useState(rotations[0]);

	useEffect(() => {
		const random = Math.floor(Math.random() * rotations.length);
		setRotation(rotations[random]);
	}, []);

	const PageHeaderWrapper = styled.div`
		height: 30vh;
		display: flex;
        align-items: center;
        overflow: visible;
        
        .ticker {
            transform: rotate(${rotation})};
            position: relative;
            z-index: -1;
        }

		h1 {
			-webkit-text-stroke-width: 2px;
			-webkit-text-stroke-color: black;
			color: transparent;
		}
	`;

	return (
		<Wrapper>
			<PageHeaderWrapper>
				<Tick tickerSpeed={5} offset={"-10%"}>
					{() => (
						<span>
							<h1 className="display">{props.title}&nbsp;</h1>
						</span>
					)}
				</Tick>
			</PageHeaderWrapper>
		</Wrapper>
	);
}
