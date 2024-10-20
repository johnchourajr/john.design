import { sortWorkByDate } from '@/lib/utils/sortWorkByDate';
import { PageItem } from '../types/content-types';

const daylightData: PageItem[] = [
  {
    slug: 'retool-dot-com',
    title: 'Retool Site',
    date: '2024-9-12',
    externalHref: 'https://retool.com/',
  },
  {
    slug: 'retool-blog',
    title: 'Retool Blog',
    date: '2024-5-1',
    externalHref: 'https://retool.com/blog/',
  },
  {
    slug: 'retool-pipes',
    title: 'Pipes',
    date: '2023-12-1',
    externalHref: 'https://retool.com/pipes/',
  },
  {
    slug: 'retool-state-of-ai-2023',
    title: 'State of AI 2023',
    date: '2023-11-1',
    externalHref: 'https://retool.com/reports/state-of-ai-2023/',
  },
  {
    // href: "/work/paypal",
    slug: 'paypal',
    title: 'PayPal.com',
    date: '2022-6-1',
    status: 'Coming Soon',
  },
  {
    // href: "/work/godaddy-point-of-sale",
    slug: 'godaddy-point-of-sale',
    title: 'GoDaddy Point of Sale',
    date: '2021-9-1',
    status: 'Coming Soon',
  },
  {
    // href: "/work/godaddy-commerce",
    slug: 'godaddy-commerce',
    title: 'GoDaddy Commerce',
    date: '2021-9-1',
    status: 'Coming Soon',
  },
  {
    // href: "/work/happy-money-office",
    slug: 'happy-money-office',
    title: 'Happy Money Office',
    date: '2020-2-1',
    status: 'Coming Soon',
  },
  {
    // href: "/work/happy-money",
    slug: 'happy-money',
    title: 'Happy Money Brand',
    date: '2020-1-1',
    status: 'Coming Soon',
  },
  {
    // href: "/work/joy-app",
    slug: 'joy-app',
    title: 'Joy App',
    date: '2018-1-1',
    status: 'Coming Soon',
  },
  {
    // href: "/work/vizio-smartcast",
    slug: 'vizio-smartcast',
    title: 'Vizio SmartCast',
    date: '2015-1-1',
    status: 'Coming Soon',
  },
];

const moonlightData: PageItem[] = [
  {
    slug: 'goodheart-bread',
    title: 'goodheartbread.com',
    date: '2024-10-5',
    tags: ['Design', 'Dev'],
    externalHref: 'https://goodheartbread.com/',
  },
  {
    slug: 'muybuen-cursor',
    title: 'cursor.muybuen.dev',
    date: '2024-10-1',
    tags: ['Dev', 'Open Source'],
    externalHref: 'https://cursor.muybuen.dev/',
  },
  {
    slug: 'muybuen-type',
    title: 'type.muybuen.dev',
    date: '2024-5-1',
    tags: ['Dev', 'Open Source'],
    externalHref: 'https://type.muybuen.dev/',
  },
  {
    slug: 'buen-coffee',
    title: 'muybuen.coffee',
    date: '2024-1-1',
    tags: ['Design', 'Dev'],
    externalHref: 'https://muybuen.coffee/',
  },
  {
    slug: 'the-grand',
    title: 'thegrandlb.com',
    date: '2022-9-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    externalHref: 'https://thegrandlb.com/',
  },
  {
    slug: 'the-cape',
    title: 'thecape.agency',
    date: '2023-11-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    externalHref: 'https://thecape.agency/',
  },
  {
    slug: 'smile-gdp',
    title: 'smilegdp.com',
    date: '2022-5-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    externalHref: 'https://smilegdp.com/',
  },
  {
    slug: 'petroleum-club',
    title: 'lbpetroleum.club',
    date: '2022-8-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    externalHref: 'https://lbpetroleum.club/',
  },
  {
    slug: 'chris-rushing',
    title: 'chrisrushing.com',
    date: '2022-6-1',
    tags: ['Design', 'Dev'],
    externalHref: 'https://chrisrushing.com/',
  },
  {
    slug: 'kelsey-dake',
    title: 'kelseydake.com',
    date: '2022-6-1',
    tags: ['Design', 'Dev'],
    externalHref: 'https://kelseydake.com/',
  },
  {
    slug: 'golden-state',
    title: 'Golden State Coffee',
    date: '2019-1-1',
    tags: ['Brand Design'],
    status: 'Coming Soon',
  },
  {
    slug: 'arcade',
    title: 'Arcade Coffee',
    date: '2018-2-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    status: 'Coming Soon',
  },
  {
    slug: 'fermensch',
    title: 'Fermensch Kombucha',
    date: '2018-1-1',
    tags: ['Brand Design'],
    status: 'Coming Soon',
  },
];

export const workContent = {
  daylightData: {
    title: 'Daylight Work',
    list: sortWorkByDate(daylightData),
  },
  moonlightData: {
    title: 'Moonlight Work',
    list: sortWorkByDate(moonlightData),
  },
};
