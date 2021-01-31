import React from 'react';
import { Wrapper } from './style/global-styles';
import styled from 'styled-components';
import { changeBodyClass, stringToSlug } from '../functions/util';
import MotionScroll from './motion-scroll';

export default function SectionJobs({ jobs }) {
  console.log({ jobs });
  return (
    <JobSection className="section" fadeIn triggerPoint={1.5} yOffset={200}>
      <Wrapper className="pV">
        <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={60}>
          <h4>Past and Present</h4>
          <br />
        </MotionScroll>
        <JobList>
          {jobs.map((item, i) => {
            const slug = stringToSlug(item.name);
            const active = !item.date.includes('Present')
              ? `inactive`
              : `active`;
            return (
              <JobItem
                key={i}
                className={`${active}`}
                onMouseEnter={() => changeBodyClass('enter', `job-${slug}`)}
                onMouseLeave={() => changeBodyClass('exit', `job-${slug}`)}
                fadeIn={true}
                triggerPoint={0.85}
                yOffset={100}
              >
                <h3 className="display">{item.title} </h3>

                <aside>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <h4>{item.name} </h4>
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

const JobSection = styled(MotionScroll)`
  background-color: ${(props) => props.theme.colors.gray4};
`;

const JobList = styled.div`
  display: list-item;
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
      /* text-decoration-color: ${(props) => props.theme.colors.gray2};
      color: ${(props) => props.theme.colors.gray3}; */
    }
    h4 {
      opacity: 0.5;
      /* color: ${(props) => props.theme.colors.gray3}; */
    }
  }

  aside {
    text-align: right;

    * {
      margin: 0;
    }
  }
`;
