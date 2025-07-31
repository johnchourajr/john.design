---
type: "post"
template: "post"
slug: "/journal-images/nav-show-hide"
date: "2024-5-1"
title: Make a Nav Show and Hide On Scroll
cover: /journal-images/images/nav-cover.svg
videoCover: /journal-images/video/nav-cover.mp4
thumb: /journal-images/images/nav-cover.svg
tags:
  - Dev
  - Framer motion
  - TypeScript
---

> Note: This is an update to an article written in 2021. This new update is written in `TypeScript` and on the latest version of `framer-motion` (v11.0.14). Enjoy.
>

A straightforward and well-built show/hide on scroll feature can significantly enhance the user experience on a website. This feature can serve two primary functions:
1. It can reduce distractions, allowing content to take center stage while keeping navigation within easy reach, and
2. It can enable a change in the scale of the nav header, which can start large and minimize upon scrolling. These two techniques can also be combined.

This show/hide or minimize/maximize effect is something I've enjoyed incorporating into websites for years. It dates back to 2015 when I created a vanilla JavaScript version, inspired by Marius Craciunoiu's [article](https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c) from 2013.

In this article, I'll outline how to implement this interactive pattern in a React app using modern React and Framer Motion techniques. If you're unfamiliar with Framer Motion, it's a powerful tool developed by the creators of Framer. It facilitates performant hardware-accelerated runtime animation for JavaScript applications. (add more about Framer Motion)

## Getting started

Start with your basic app shell. If you have an existing react project, adapt this to your project structure. If you're following along, use this [react typescript starter](https://codesandbox.io/p/sandbox/scroll-nav-show-hide-typescript-mqjj7k) on CodeSandbox.

Begin in your root app layout, which might look something like this.

```tsx
// App.tsx
import "./styles.css";

export default function App() {
  return <div className="App"></div>;
}

```

Next, you'll create the `Nav` component. I placed mine in the `src` directory and named the file `Nav.tsx`. In this `Nav` component, I'm establishing a few basic elements: 1) the fundamental structure of the navigation bar, with a logo on the left and navigation links on the right, 2) some basic styles for the navigation bar to ensure it's visually appealing, and 3) a small array called `linkList` that I'm using with `.map()` to generate some placeholder navigation links efficiently.

```tsx
// Nav.tsx
// Create this file and use the code below

/** this is to FPO generate 5 links for the nav **/
const linkList: string[] = ["", "", "", "", ""];

export function Nav() {
  return (
    <nav className="navStyles">
      <p>Logo</p>
      <div className="navLinksWrapper">
        {linkList.map((item, i) => (
          <a key={i} href="#">Link</a>
        ))}
      </div>
    </nav>
  );
}
```

And add this to the existing `styles.css` file

```css
/* styles.css */
/* Add styles below .App */

.App {
  font-family: sans-serif;
  text-align: center;
  height: 200vh;
}

.navStyles {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  height: 6rem;
  padding: 0 2rem;
  width: calc(100vw - 4rem);
  left: 0;
}

.navLinksWrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
}
```

After creating the `Nav.tsx` file, import it into `App.js` and include it as a child of the main `div` wrapper. Additionally, add styles to provide some height to the page.

```jsx
// App.tsx
import { Nav } from "./Nav";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Nav />
    </div>
  );
}
```

At this point, you should have a basic page with a fixed navigation bar and a scrollable body. It's very straightforward.

## Now the fun part

First, add Framer Motion as a dependency. You can do this by running `npm install framer-motion` in your terminal. Make sure to run this command at the root of your project directory. After the installation, add `import { motion } from "framer-motion"` it into your `Nav.tsx` file. Remember to prefix your `<nav>` with `motion`, changing it to `<motion.nav>`. This will convert your element into a motion component.

```jsx
// Nav.tsx

/** Import framer-motion **/
import { motion } from "framer-motion";

/** ... **/

export function Nav() {
  return (
    <motion.nav /** Add 'motion.' prefix to 'nav' ... **/  >
      /** ... **/
    </motion.nav>
  );
}
```

Now, we'll add the `useScroll` hook. This listens to the page's scroll and returns the absolute scroll position as a motion value with the `scrollY` constant. After that, we'll introduce the `useMotionValueEvent` hook. This lets you pass the `scrollY` motion value during the `“change”` event into the React lifecycle. For now we’ll just log it to the console, to demonstrate what’s happening here. Check out the console to see those events firing.

```jsx
// Nav.tsx
/** Add useMotionValueEvent and useScroll to the import **/
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

/** ... **/

export default function Nav() {
  /** Add this section **/
  const { scrollY } = useScroll();

  /** Use the useMotionValueEvent hook to listen to "change" events **/
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    console.log({ latest });
  });

  return (
    <motion.nav /** ... **/ >
      /** ... **/
    </motion.nav>
  );
}
```

With the hooks functioning properly, we can use them to trigger some state changes.

```tsx
// Nav.tsx
/** ... **/

export default function Nav() {

  /** ... **/

  // Use useState hook to manage state
  const [hidden, setHidden] = useState(false);
  const [prev, setPrev] = useState(0);

  // This onUpdate function is called in the `scrollY.onChange` callback
  function update(latest: number, prev: number): void {
    if (latest < prev) {
      setHidden(false);
      console.log("visible");
    } else if (latest > 100 && latest > prev) {
      setHidden(true);
      console.log("hidden");
    }
  }

  // Add `update()` function and `setPrevScroll` state handler
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    update(latest, prevScroll);
    setPrevScroll(latest);
  });

  return (
    <motion.nav /** ... **/ >
      /** ... **/
    </motion.nav>
  );
}
```

If you examine your console, you'll notice "visible" and "hidden" events triggering each time you scroll up and down.

### Hooking it all up

Now we're going to use a framer-motion method called `variants` to convert the `hidden` state boolean into animated states. We just need to assign keys for each state (in this case, "visible" and "hidden") along with their respective style object. Once you implement this code, you should be thrilled to see it in action!

```jsx
// Nav.tsx
/** ... **/

/** Define variants for the parent container styles **/
const parentVariants = {
  /** Define the "visible" state and its styles **/
  visible: { opacity: 1, y: 0 },
  /** Define the "hidden" state and its styles **/
  hidden: { opacity: 0, y: "-4rem" },
};

export default function Nav() {

  /** ... omitted for brevity **/

  return (
    <motion.nav
	    className="navStyles"
      /** Pass the variants object into the motion component **/
      variants={parentVariants}
      /** Match boolean state with these variant keys **/
      animate={hidden ? "hidden" : "visible"}
      /** Add a custom easing curve and duration for the animation **/
      transition={{
        ease: [0.1, 0.25, 0.3, 1],
        duration: 0.6,
        staggerChildren: 0.05,
      }}
    >
      /** ... **/
    </motion.nav>
  );
}
```

As a final step, we'll add some flair to the link elements. Framer motion has a great feature that allows the `animate` state to propagate down to child motion elements without an explicit `animate` prop. We can accomplish this by setting variants and transition settings on the `motion.a` element.

```jsx
// Nav.tsx
/** ... **/

const parentVariants = {
  /** ... **/
};

/** Variants for the child container styles **/
const childVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: "-2rem" },
};

export default function Nav() {

  /** ... omitted for brevity **/

  return (
    <motion.nav
	    /** ... **/
    >
	    /** ... **/

      {linkList.map((item, i) => (
        <motion.a  /** Changed to motion.a **/
          key={i}
          variants={childVariants} /** Added variants **/
          transition={{
            ease: [0.1, 0.25, 0.3, 1],
            duration: 0.4,
          }} /** Set up transition configuration **/
        >
          Link
        </motion.a>
      ))}
	    /** ... **/
    </motion.nav>
  );
}
```

### Here is the preview

That's all, folks. You can preview the result below or explore the full example on [CodeSandbox](https://codesandbox.io/p/sandbox/ancient-dust-5j7gc9?file=%2Fsrc%2FApp.tsx%3A11%2C1).

We've created a straightforward, React and TypeScript method to show and hide navigation elements based on scrolling. You can enhance the animation by adding more properties to the variants object.

<iframe src="https://codesandbox.io/embed/5j7gc9?view=preview&module=%2Fsrc%2FApp.tsx"
     style="width:100%; height: 800px; border-radius: 4px; overflow:hidden;"
     title="Framer Motion Nav Show Hide (2024 Updated Version)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

—

Thanks for reading! – John