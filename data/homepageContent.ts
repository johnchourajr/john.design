import { getRandomParentAndChildClassesArray } from "@/components/justified-headline/data";

import type {
  SectionStructure,
  TextList,
  TextStructure,
} from "../types/content-types";

export type HomePageData = {
  heroSection: {
    headlineData: TextStructure[];
    typographies: TextStructure[];
    informationalChunks: {
      text: TextList;
    }[];
  };
  rolesSection: SectionStructure;
  personalSection: SectionStructure;
  resumeSection: {
    resumeList: {
      title: string;
      role: string;
      company: string;
      showLogo: boolean;
      url: string;
    }[];
  } & SectionStructure;
};

export const homepageContent: HomePageData = {
  heroSection: {
    headlineData: [
      {
        text: "John Is",
        motionObject: getRandomParentAndChildClassesArray(8),
        className: "z-[100] relative headline-display-xs",
      },
      {
        text: "Working On",
        motionObject: getRandomParentAndChildClassesArray(8),
      },
      {
        text: "The *Internet*",
        motionObject: getRandomParentAndChildClassesArray(8),
      },
    ],
    typographies: [
      {
        size: "text-title",
        text: "This is John Choura",
      },
      {
        size: "text-body",
        text: "What's in a name?",
      },
    ],
    informationalChunks: [
      {
        text: [
          "JOHN, ",
          "*(/dʒɒn/; JON)* ",
          "the given name from the hebrew “Yochanan” and the anglo “Johanan”, meaning ",
          "*“Yahweh has been gracious.”*",
        ],
      },
      {
        text: [
          "Choura, ",
          "*(/K-0rr-Uh/; cora)* ",
          "the last name of Czechoslovakian origin, ",
          "*meaning unknown*",
          ".",
        ],
      },
    ],
  },
  rolesSection: {
    text: [
      "Art Director ",
      {
        text: "Balancing execution across visual identity, motion, photo/video, and more into singular brand experiences",
      },
      ", Interactive Designer ",
      {
        text: "The ability to create customer centric digital experiences across web and mobile platforms at scale",
      },
      ", and Creative Developer ",
      {
        text: "The ability to use code as a tool to create interactive and engaging production-ready interfaces ",
      },
    ],
  },
  personalSection: {
    title: "Personal Stuff",
    list: [
      "Father of 2",
      "Husband of 1",
      "Coffeephile",
      "Tinkerer",
      "Artist",
      "Optimist",
      "Goofy dude",
      "El Camino Owner",
      "WFH-er",
      "INFJ",
      "Learner",
      "Sensitive guy",
    ],
  },
  resumeSection: {
    resumeList: [
      {
        title: "Currently [2023—]",
        role: "Interactive Designer",
        showLogo: true,
        company: "Retool",
        url: "https://retool.com",
      },
      {
        title: "Previously [2022—2023]",
        role: "Design Lead",
        showLogo: true,
        company: "PayPal",
        url: "https://paypal.com",
      },
      {
        title: "Formerly [2020—2022]",
        role: "Principal Designer",
        showLogo: true,
        company: "GoDaddy",
        url: "https://godaddy.com",
      },
      {
        title: "Before That [2015—2020]",
        role: "Design Director",
        showLogo: true,
        company: "Happy Money",
        url: "https://happymoney.com",
      },
      {
        title: "And Before That [2014—2015]",
        role: "Art Director",
        showLogo: false,
        company: "Envoy",
        url: "https://weareenvoy.com",
      },
      {
        title: "In the beginning [2012—2014]",
        role: "Designer",
        showLogo: false,
        company: "Biola University",
        url: "https://biola.edu",
      },
    ],
  },
};
