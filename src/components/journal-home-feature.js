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
            <h2>{title}</h2>
          </Link>
        </CardLowerTitle>
        <CardLowerDetails>
          <h1 className="arrow">→</h1>
          <h4>{date}</h4>
          <h4>{timeToRead} Minute Read</h4>
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
  margin: 2rem 0 2rem;
  transition: transform ${(props) => props.theme.animation.duration[300].css};
  will-change: transform;
  cursor: pointer;

  &:hover {
    transform: scale3d(1.01, 1.01, 1.01);

    h2 {
      text-decoration: underline;
    }

    ${Image} {
      background-size: 101%;
    }

    .arrow {
      text-decoration: none !important;
    }
  }

  &:active {
    transform: scale3d(0.99, 0.99, 0.99);
  }
`;

const CardLower = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1.5rem 0 2rem;
`;

const CardLowerTitle = styled.div`
  width: 30.3125em;

  a {
    display: inline-block;
  }
`;

const CardLowerDetails = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  h4 {
    margin: 0;
    color: ${(props) => props.theme.colors.gray3};
  }
`;
