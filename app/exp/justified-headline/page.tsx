import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { JustifiedHeadlineExperiment } from './JustifiedHeadlineExperiment';

// Layouts are picked on the server so the static HTML and the client agree.
export default function Page() {
  const headlineData = [
    {
      text: 'John Is',
      motionObject: getRandomParentAndChildClassesArray(8),
      className:
        'z-100 relative text-[1rem]! lg:text-[1vw]! tracking-wider! uppercase',
    },
    {
      text: 'Working On',
      motionObject: getRandomParentAndChildClassesArray(8),
    },
    {
      text: 'The *Internet*',
      motionObject: getRandomParentAndChildClassesArray(8),
    },
  ];

  return <JustifiedHeadlineExperiment headlineData={headlineData} />;
}
