---
template: "journal-post-template"
slug: "/journal/nav-show-hide"
date: "2021-02-18"
title: Make a Nav Show and Hide On Scroll
cover: ../../../images/journal/nav-cover.svg
thumb: ../../../images/journal/nav-cover.svg
---

Making a nav show and hide on scroll looks good. In the past, I've created a vanilla js version inspired by what Marius Craciunoiu wrote about in [this article](https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c) circa 2013.

I always loved this method, as it did what I needed it to do for many-a site, but javascript has changed a lot since 2013. With advancements within React with hooks, plus with new libraries like Framer Motion. So I found myself building the very site you're reading this on, which is a Reacjt JS Gatsby site, and wanted to find a more modern method to create this effect, which led me to a solution which I share here.

## Getting started

You'll get started with your basic app shell, if you already have a react project you'll have to adapt this to your project structure. Or if you want to follow along you can use this [create-react-app starter](https://codesandbox.io/s/x335plk7xo) on CodeSandbox.

First, you'll start in your root app layout, that will look something like this.

```jsx
// App.js

export default function App() {
  return <div className="App"></div>;
}
```

Okay, now you'll create the `Nav` component, for mine I put it in the root directory and called the file `nav.js`. In this `Nav` component I'm setting up a few simple things: 1) the base structure of nav, with a logo on the left and nav links on the right, 2) some base styles for the nav so it doesn't look terrible, and 3) I'm setting up a small array with `linkList` to `.map()` over in order to generate some faux nav links in a clean way.

```jsx
// nav.js
// Create this file and use the code below

import React from "react";

/** this is to FPO generate 5 links for the nav **/
const linkList = [{}, {}, {}, {}, {}];

/** nav parent styles **/
const navStyles = {
  display: "flex",
  position: "fixed",
  alignItems: "center",
  justifyContent: "space-between",
  height: "6rem",
  padding: "0 2rem",
  width: "calc(100vw - 4rem)",
  left: "0",
};

/** links parent styles **/
const navLinksWrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "50%",
};

export default function Nav() {
  return (
    <nav style={navStyles}>
      <span>Logo</span>
      <div style={navLinksWrapper}>
        {linkList.map((item, i) => (
          <span key={i}>Link</span>
        ))}
      </div>
    </nav>
  );
}
```

Once you create that `nav.js` file, let's import it into `App.js` and include it as a child of your main `div` wrapper. I've also added styles to give the page some height.

```jsx
// App.js

import Nav from "./nav"; /** import Nav **/

/** add this **/
const wrapperStyle = {
  height: "200vh",
};

export default function App() {
  return (
    <div className="App" style={wrapperStyle} /** include styles here **/>
      /** inlcude nav component **/
      <Nav />
    </div>
  );
}
```

What you should have at this point is a basic page with a fixed nav and and a scrollable body. Super basic stuff.

## Now the fun part

Let's add Framer Motion as a dependency. To do this run `npm install framer-motion` in your terminal at the root of your project directory. Once that's good to go, you'll import it into your `nav.js` file. It's also important to prefix your `<nav>` with `motion`, this will make your element motion component.

```jsx
// nav.js
import React from 'react';
/** import framer-motion **/
import { motion, useViewportScroll } from "framer-motion";

...

export default function Nav() {
  return (
    <motion.nav /** add 'motion.' prefix to 'nav' **/ ... >
      ...
    </motion.nav>
  );
}
```

Now we're going to use the `useViewportScroll` hook from framer-motion to get the scroll y-axis value. We'll also be using the react `useEffect` hook to fire an `onChange` callback for the `scrollY` value updating.

```jsx
// nav.js
...

export default function Nav() {
  /** add this bit **/
  const { scrollY } = useViewportScroll();

  /** add this useEffect hook to return events everytime the scrollY changes **/
  React.useEffect(() => {
    return scrollY.onChange(() => console.log(scrollY));
  });

  return (
    <motion.nav ... >
      ...
    </motion.nav>
  );
}
```

If this is working well, you should see this in your log:

```shell
MotionValue {timeDelta: 0, lastUpdated: 0, updateSubscribers: Object, renderSubscribers: Object, canTrackVelocity: true ...}
```

With the hooks working well we can make them trigger some state changes.

```jsx
// nav.js
...

export default function Nav() {

  ...

  /** add useState hook to manage state **/
  const [hidden, setHidden] = React.useState(false);

  /** this onUpdate function will be called in the `scrollY.onChange` callback **/
  function update() {
    if (scrollY?.current < scrollY?.prev) {
      setHidden(false);
      console.log("visible");
    } else if (scrollY?.current > 100 && scrollY?.current > scrollY?.prev) {
      setHidden(true);
      console.log("hidden");
    }
  }

  /** update the onChange callback to call for `update()` **/
  React.useEffect(() => {
    return scrollY.onChange(() => update());
  });

  return (
    <motion.nav ... >
      ...
    </motion.nav>
  );
}
```

If you look in your console, you should see "visible" and "hidden" events firing everytime you scroll up and down.

### Hooking it all up

Now we're going to interpret the `hidden` state boolean into animated states using a framer-motion method called `variants`. All we need to do here is set keys for each state (in this case, "visible" and "hidden") with their own style object. Once you plug in this code you should be excited to see this working!

```jsx
// nav.js
...

export default function Nav() {

  ... // removing for brevity

  /** add this const **/
  const variants = {
    /** this is the "visible" key and it's respective style object **/
    visible: { opacity: 1, y: 0 },
    /** this is the "hidden" key and it's respective style object **/
    hidden: { opacity: 0, y: -25 }
  };

  return (
    <motion.nav
      /** the variants object needs to be passed into the motion component **/
      variants={variants}
      /** it's right here that we match our boolean state with these variant keys **/
      animate={hidden ? "hidden" : "visible"}
      /** I'm also going to add a custom easing curve and duration for the animation **/
      transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
      ...
    >
      ...
    </motion.nav>
  );
}
```

### Here is the preview

And that's all folks. The result can be previewed below, or you can checkout the full example on [CodeSandbox](https://codesandbox.io/s/framer-motion-nav-show-hide-article-version-omnnd?file=/src/nav.js).

What we've made here is a super simple modern javascript method for showing and hiding nav elements based on scroll. You can even get more creative with the animation method by adding more properties to the variants object.

<iframe src="https://codesandbox.io/embed/framer-motion-nav-show-hide-article-version-omnnd?autoresize=1&fontsize=12&module=%2Fsrc%2Fnav.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Framer Motion Nav Show Hide (Article Version)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

—

Thanks for reading! – John
