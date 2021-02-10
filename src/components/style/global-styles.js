import styled from 'styled-components';

export const PageWrapper = styled.div`
  margin: 0 auto;
  width: 100vw;
  overflow: hidden;
  color: ${(props) => props.theme.colors.black};
  font-family: 'LabilGrotesk-Medium', sans-serif;
  font-style: normal;
  font-weight: 500;
`;

export const Wrapper = styled.section`
  padding: 0 1rem;
  width: 100%;

  @media ${(props) => props.theme.device.tablet} {
    padding: 0 7vw;
  }

  &.pV {
    padding-top: 7vw;
    padding-bottom: 7vw;
  }
`;
