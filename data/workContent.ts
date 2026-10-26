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
    slug: 'bueno-fund',
    title: 'bueno.fund',
    date: '2026-2-16',
    tags: ['Design', 'Dev'],
    overview:
      'A funding platform for local businesses and creators to rally their community around what they are building. Designed and built end to end, from campaign pages, backer tiers and checkout to the creator dashboard, with a hand-drawn brand of stickers and illustrations.',
    deliverables: [
      'Product design',
      'Brand and illustration',
      'Campaign pages',
      'Backer tiers and checkout',
      'Creator dashboard',
      'Marketing site',
      'Guides and release notes',
    ],
    externalHref: 'https://bueno.fund/',
  },
  {
    slug: 'processcreative',
    title: 'Process Creative',
    date: '2025-5-1',
    tags: ['Design', 'Dev'],
    overview:
      'A new website for Process Creative, a film production company and creative studio in Orange County, built to put their films first.',
    deliverables: ['Website design', 'Development on Prismic', 'Selected work showcase'],
    externalHref: 'https://processcreative.co/',
  },
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
    overview:
      "Website, signage and social for The Grand, an event venue in Long Beach, carried through a 2023 refresh. Earlier work for the venue's catering side, Grand Food & Beverage, set its identity.",
    deliverables: [
      'Website design and build',
      'Signage and wayfinding',
      'Outdoor banners',
      '2023 site and social refresh',
      'Grand Food & Beverage identity',
    ],
    externalHref: 'https://thegrandlb.com/',
  },
  {
    slug: 'smile-gdp',
    title: 'smilegdp.com',
    date: '2022-5-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    externalHref: 'https://smilegdp.archive.john.design/',
  },
  {
    slug: 'petroleum-club',
    title: 'lbpetroleum.club',
    date: '2022-8-1',
    tags: ['Design', 'Dev', 'Art Direction'],
    overview:
      "Brand, website and a photo and video shoot for the Petroleum Club, a mid-century event venue in Long Beach relaunched around one idea: stay classy.",
    deliverables: [
      'Brand identity',
      'Website design and build',
      'Photo and video art direction',
      'Social campaign',
      'Red Room signage',
      'Ballroom mural',
    ],
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
    overview:
      "A rebrand for a specialty coffee roaster, carried from the mark and type system through packaging to the shop's website. The diagonal ARCADE lockup became the 12oz bag, and the same system still runs the storefront.",
    deliverables: [
      'Brand identity',
      'Logo and monogram system',
      'Brand guidelines',
      '12oz bag and labels',
      'Subscription box',
      'Stationery',
      'Website design and build',
    ],
    status: 'Coming Soon',
  },
  {
    slug: 'fermensch',
    title: 'Fermensch Kombucha',
    date: '2018-1-1',
    tags: ['Brand Design'],
    overview:
      'A rebrand for a kombucha brewery in Orange, California, built on hand-drawn lettering, lightning bolts and a motto to live by: be a mensch.',
    deliverables: [
      'Brand identity',
      'Hand lettering',
      'Brand manual',
      'Growler art and keg collars',
      'Business cards and postcards',
      'Now Serving sign',
      'Social kit',
      'Delivery van lettering',
    ],
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
