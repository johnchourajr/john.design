import React from 'react';
import { Link, navigate } from 'gatsby';
import styled from 'styled-components';

export default function JournalHomeFeature({
  slug,
  cover,
  title,
  date,
  timeToRead,
  excerpt
}) {
  return (
    <Card onClick={() => navigate(slug)}>
      {cover && <Image style={{ backgroundImage: `url(${cover})` }}></Image>}
      <CardLower>
        <CardLowerTitle>
          <Link to={slug}>
            <h1>{title}</h1>
          </Link>
        </CardLowerTitle>
        <CardLowerDetails>
          <h1 className="arrow">→</h1>
          <span>
            <h4>{date}</h4>
            <h4>{timeToRead} Minute Read</h4>
          </span>
        </CardLowerDetails>
      </CardLower>
    </Card>
  );
}

const Image = styled.div`
  width: 100%;
  height: 35vw;
  background-size: 105%;
  background-position: center center;
  border-radius: 0.1875rem;
  transition: background-size
    ${(props) => props.theme.animation.duration[300].css};
`;

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: solid 0.375rem ${(props) => props.theme.colors.black};
  margin: 2rem 0 4rem;
  transition: transform ${(props) => props.theme.animation.duration[300].css};
  will-change: transform;
  cursor: pointer;

  &:hover {
    transform: scale3d(1.01, 1.01, 1.01);

    h1 {
      text-decoration: underline;
    }

    ${Image} {
      background-size: 101%;
    }

    .arrow {
      text-decoration: none !important;
    }
  }
`;

const CardLower = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 0 2rem;

  @media ${(props) => props.theme.device.tablet} {
    flex-direction: row;
  }
`;

const CardLowerTitle = styled.div`
  max-width: 40em;

  a {
    display: inline-block;
  }
`;

const CardLowerDetails = styled.aside`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  min-width: 10em;

  @media ${(props) => props.theme.device.tablet} {
    flex-direction: column;
    align-items: flex-end;
    justify-content: initial;

    span {
      text-align: right;
    }
  }

  h4 {
    margin: 0;
    color: ${(props) => props.theme.colors.gray2};
  }
`;
