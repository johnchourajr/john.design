import { DynamicJustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { contactData } from '@/data/contactContent';
import clsx from 'clsx';
import Link from 'next/link';

export default function WorkPage({
  title,
  contactSocial,
  contactEmail,
}: typeof contactData) {
  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        {title.map((item, i) => (
          <DynamicJustifiedHeadlineInner
            key={i}
            className={clsx(
              'leading-[1] w-full font-black pointer-events-none',
            )}
            headline={[
              {
                text: item,
                motionObject: getRandomParentAndChildClassesArray(8),
              },
            ]}
            iterations={8}
            letters={true}
          />
        ))}
      </section>
      <section className="my-[8vw] px-4">
        <h2 className="text-string">Social</h2>
        <div className="flex flex-wrap whitespace-pre">
          {contactSocial.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              target="_blank"
              className={clsx(
                'group flex gap-1',
                'headline-display-sm sm:headline-display-md',
                'text-left group z-50 relative mt-4',
              )}
            >
              <span className="no-underline group-hover:underline underline-offset-4 decoration-2">
                {item.title}
              </span>
              {i === contactSocial.length - 1 ? '' : ', '}
            </Link>
          ))}
        </div>
      </section>
      {contactEmail.map((item, i) => (
        <section key={i} className="my-[8vw] px-4">
          <h2 className="text-string">{item.title}</h2>
          <Link
            href={`mailto:${item.email}`}
            target="_blank"
            className={clsx(
              'group flex gap-1',
              'headline-display-sm sm:headline-display-md',
              'text-left group z-50 relative mt-4',
            )}
          >
            <span className="no-underline group-hover:underline underline-offset-4 decoration-2">
              {item.email}
            </span>
          </Link>
        </section>
      ))}
    </>
  );
}

export function getStaticProps() {
  return {
    props: {
      ...contactData,
    },
  };
}
