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
      logo: string;
      role: string;
      company: string;
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
        title: "Currently",
        logo: "https://via.placeholder.com/100",
        role: "Designer",
        company: "Retool",
        url: "https://retool.com",
      },
      {
        title: "Previously",
        logo: "https://via.placeholder.com/100",
        role: "Design Lead",
        company: "PayPal",
        url: "https://paypal.com",
      },
      {
        title: "Formerly",
        logo: "https://via.placeholder.com/100",
        role: "Pricipal Designer",
        company: "GoDaddy",
        url: "https://godaddy.com",
      },
      {
        title: "Before That",
        logo: "https://via.placeholder.com/100",
        role: "Design Director",
        company: "Happy Money",
        url: "https://happymoney.com",
      },
      {
        title: "And Before That",
        logo: "https://via.placeholder.com/100",
        role: "Art Director",
        company: "Envoy",
        url: "https://weareenvoy.com",
      },
      {
        title: "In the beginning",
        logo: "https://via.placeholder.com/100",
        role: "Designer",
        company: "Biola University",
        url: "https://biola.edu",
      },
    ],
  },
};
