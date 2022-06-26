import React from "react";
import Link from "next/link";
import styled from "styled-components";

/**
 * JournalHomeFeature Component
 *
 * @param {Object} props
 * @param {String} props.slug
 * @param {any} props.cover
 * @param {String} props.title
 * @param {String} props.date
 * @param {String} props.timeToRead
 */
export default function JournalHomeFeature({
  slug,
  cover,
  title,
  date,
  timeToRead,
}) {
  const isChildImageSharp = cover.childImageSharp;
  const image = isChildImageSharp
    ? cover.childImageSharp?.fluid
    : cover.publicURL;

  return (
    <Card href={slug}>
      <a>
        {cover && (
          <Image>
            {isChildImageSharp ? (
              <img
                sizes={image.sizes}
                srcSet={image.srcSet}
                alt={`${title} Cover Art`}
              />
            ) : (
              <img src={image} alt={`${title} Cover Art`} />
            )}
          </Image>
        )}
        <CardLower>
          <CardLowerTitle>
            <Link href={slug}>
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
      </a>
    </Card>
  );
}

const Image = styled.div`
  width: 100%;
  height: 50vw;
  background-size: 105%;
  background-position: center center;
  border-radius: 0.1875rem;
  overflow: hidden;

  @media ${(props) => props.theme.device.laptop} {
    width: 100%;
    height: 35vw;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale3d(1.01, 1.01, 1.01);
    transition: transform ${(props) => props.theme.animation.duration[300].css};
  }
`;

const Card = styled(Link)`
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
