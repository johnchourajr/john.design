import clsx from 'clsx';

import { SvgGoDaddy } from '@/components/svg/SvgGoDaddy';
import { SvgHappyMoney } from '@/components/svg/SvgHappyMoney';
import { SvgPayPal } from '@/components/svg/SvgPayPal';
import { SvgRetool } from '@/components/svg/SvgRetool';
import { HomePageData } from '@/data/homepageContent';
import { WrapLetterWords, WrapWords } from '@/lib/utils/wrapInSpans';

import type { SVGProps } from 'react';
export type ResumeSectionProps = HomePageData['resumeSection'];

export function ResumeSection({ title, resumeList }: ResumeSectionProps) {
  const logoMapping: Record<
    string,
    (props: SVGProps<SVGSVGElement>) => JSX.Element
  > = {
    GoDaddy: SvgGoDaddy,
    'Happy Money': SvgHappyMoney,
    PayPal: SvgPayPal,
    Retool: SvgRetool,
  };

  return (
    <>
      <section className="my-[6vw] ">
        {title && <h2>{title}</h2>}
        {resumeList.map((item, index) => {
          const LogoComponent = logoMapping[item.company];

          return (
            <div key={index} className="text-center clip pt-10">
              <p className="text-string pb-4">{item.title}</p>
              <p
                className={clsx(
                  'headline-display-lg-serif flex-wrap inline-flex items-center justify-center whitespace-pre-wrap-children',
                )}
              >
                {item.showLogo && LogoComponent && (
                  <span className={clsx('mr-[.25em]')}>
                    <LogoComponent
                      className="h-[1em]"
                      aria-labelledby={`company-name-${index}`}
                    />
                  </span>
                )}
                <WrapWords text={item.role} />
                <span className={clsx('h-[.85em] flex items-start mr-[.1em]')}>
                  <span className="headline-display-sm">
                    <WrapLetterWords text={item.company} />
                  </span>
                </span>
              </p>
            </div>
          );
        })}
      </section>
    </>
  );
}
