import styled from "styled-components";

export const Wrapper = styled.div`
	margin: 0 1rem;
	width: calc(100vw - 2rem);

	@media ${(props) => props.theme.device.tablet} {
		margin: 0 auto;
		width: 86vw;
	}
`;
