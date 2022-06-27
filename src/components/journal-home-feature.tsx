import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";

/**
 * JournalHomeFeature Component
 */
export default function JournalHomeFeature({
  slug,
  cover,
  title,
  date,
  exerpt,
  timeToRead,
}) {
  return (
    <Link href={slug}>
      <Card>
        {cover && (
          <ImageWrap>
            <Image src={cover} layout="fill" alt={`${title} Cover Art`} />
          </ImageWrap>
        )}
        <CardLower>
          <CardLowerTitle>
            <h1>{title}</h1>
            <h4>{exerpt}</h4>
          </CardLowerTitle>
          <CardLowerDetails>
            <h1 className="arrow">→</h1>
            <span>
              <h4>{date}</h4>
              <h4>{timeToRead} min read</h4>
            </span>
          </CardLowerDetails>
        </CardLower>
      </Card>
    </Link>
  );
}

const ImageWrap = styled.div`
  width: 100%;
  height: 50vw;
  background-position: center center;
  border-radius: 0.1875rem;
  overflow: hidden;

  @media ${(props) => props.theme.device.laptop} {
    width: 100%;
    height: 35vw;
  }
  span,
  img {
    width: 100%;
    height: 50vw !important;
    object-fit: cover;
    transform: scale3d(1.01, 1.01, 1.01);
    transition: transform ${(props) => props.theme.animation.duration[300].css};
    border-radius: 0.1875rem;
    overflow: hidden;

    @media ${(props) => props.theme.device.laptop} {
      height: 35vw !important;
    }
  }
`;

const Card = styled.a`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: solid 0.375rem ${(props) => props.theme.colors.black};
  margin: 2rem 0 4rem;
  transition: transform ${(props) => props.theme.animation.duration[300].css};
  will-change: transform;
  cursor: pointer;

  a,
  a:hover {
    h1 {
      text-decoration: none !important;
    }
  }

  &:hover {
    transform: scale3d(1.01, 1.01, 1.01);

    h1 {
      text-decoration: underline;
    }

    img {
      transform: scale3d(1, 1, 1);
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
    text-decoration: none;
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
