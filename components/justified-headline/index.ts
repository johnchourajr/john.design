import dynamic from 'next/dynamic';
import { JustifiedHeadlineInner } from './JustifiedHeadlineInner';

export const DynamicJustifiedHeadlineInner = dynamic(() =>
  Promise.resolve(JustifiedHeadlineInner),
);
