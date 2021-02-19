import React from 'react';
import styled from 'styled-components';

/**
 * Local Components
 */
import MotionScroll from './motion-scroll';

/**
 * Local Styles/JS
 */
import { Wrapper } from './style/global-styles';
import { changeBodyClass, stringToSlug } from '../functions/util';

/**
 * SectionJobs component
 *
 * @param {Object} props
 * @param {Object} props.jobs
 */
export default function SectionJobs({ jobs }) {
  return (
    <JobSection id="jobs" className="section">
      <Wrapper className="pV">
        <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={30}>
          <h4>Past and Present</h4>
          <br />
        </MotionScroll>
        <JobList>
          {jobs.map((item, i) => {
            const slug = stringToSlug(item.title);
            const active = !item.date.includes('Present')
              ? `inactive`
              : `active`;
            return (
              <JobItem
                key={i}
                className={`${active}`}
                onMouseEnter={() =>
                  changeBodyClass(
                    'enter',
                    slug,
                    item.foreground,
                    item.background,
                    item.image
                  )
                }
                onMouseLeave={() =>
                  changeBodyClass(
                    'exit',
                    slug,
                    item.foreground,
                    item.background,
                    item.image
                  )
                }
                fadeIn={true}
                triggerPoint={0.85}
                yOffset={50}
              >
                <h3 className="display">{item.role} </h3>

                <aside>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <h4>{item.title} </h4>
                    <h4>{item.date} </h4>
                  </a>
                </aside>
              </JobItem>
            );
          })}
        </JobList>
      </Wrapper>
    </JobSection>
  );
}

const JobSection = styled.section`
  background-color: ${(props) => props.theme.colors.white};
`;

const JobList = styled.div`
  display: inline;
  flex-direction: column;

  &:hover {
    ${MotionScroll} h3, ${MotionScroll} h4 {
      opacity: 0.35 !important;
    }
  }
`;

const JobItem = styled(MotionScroll)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;

  h3,
  h4 {
    transition: opacity ${(props) => props.theme.animation.duration[100].css};
    will-change: opacity, transform;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:hover {
    h3,
    h4 {
      opacity: 1 !important;
      font-feature-settings: 'ss02' on, 'ss05' on, 'salt' on, 'ss01' on !important;
    }
  }

  &.inactive {
    opacity: 0.5;

    h3 {
      opacity: 0.5;
      text-decoration: line-through;
      text-decoration-thickness: 0.065em;
    }
    h4 {
      opacity: 0.5;
    }
  }

  aside {
    text-align: right;
    padding-left: 1rem;
    max-width: 12rem;

    * {
      display: inline;
      margin: 0;
    }
  }
`;
