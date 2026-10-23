import { afterimage } from './afterimage';
import { dotGain } from './dotGain';
import { everythingFalls } from './everythingFalls';
import { interference } from './interference';
import { massBendsLight } from './massBendsLight';
import { outOfRegister } from './outOfRegister';
import { rocaille } from './rocaille';
import type { Poster } from './types';
import { vortices } from './vortices';

/** The posters on /exp/type-posters, in order. */
export const posters: Poster[] = [
  outOfRegister,
  vortices,
  massBendsLight,
  everythingFalls,
  interference,
  rocaille,
  afterimage,
  dotGain,
];

export type { Poster } from './types';
