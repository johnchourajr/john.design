---
template: 'journal-post-template'
slug: '/journal/nav-show-hide'
date: '2021-02-18'
title: Make a Nav Show and Hide On Scroll
cover: ../../../images/journal/fpo.png
thumb: ../../../images/journal/fpo.png
---

When building a website that has a static primary nav, I like when the nav hides when scrolling down, shows when scrolling back up,and also shows when hovering the nav area. In the past, I've created a vanilla js version inspired by what Marius Craciunoiu wrote about in [this article](https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c) back in 2013. I've loved this method, as it solved for what I was looking for, but javascript has changed a lot since 2013. With advancements within React with hooks, plus with new libraries like Framer Motion, things couldn't be easier to accomplish this method with those tools.

## Getting started

You'll get started with your basic app shell, if you create any new project on Code Sandbox, this is the basic react app starter. You can use this [create-react-app starter](https://codesandbox.io/s/x335plk7xo).

```jsx
// App.js

export default function App() {
  return <div className="App"></div>;
}
```

Okay, now you'll create a new compoonent for the nav. In this `Nav` component I'm doing a few simple things: 1) I have the base structure of nav, with a logo on the left and nav links on the right. 2) I'm setting up some base styles for the nav so it doesn't look terrible. And 3) I'm setting up a small array with `linkList` to `.map()` over in order to generate some faux nav links in a clean way.

```jsx
// nav.js
// Create this file and use the code below

import React from 'react';

const linkList = [{}, {}, {}, {}, {}];

const navStyles = {
  display: 'flex',
  position: 'fixed',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '6rem',
  padding: '0 2rem',
  width: 'calc(100vw - 4rem)',
  left: '0'
};

const navLinksWrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '50%'
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

Once you create that `nav.js` file, you'll want to import it into your `App.js` file and include it as a child of your main `div` wrapper. I also added some `wrapperStyle` to put some height on the page to eventually test the scroll.

```jsx
// App.js

import Nav from './nav'; /** import Nav **/

const wrapperStyle = {
  height: '200vh'
}; /** add this **/

export default function App() {
  return (
    <div className="App" style={wrapperStyle} /** include styles here **/>
      <Nav />
    </div>
  );
}
```

What you should have at this point is a basic page with a fixed nav and and a scrollable page. Super basic stuff.

## Now the fun part

Once you get everything set up, we're going to get the Framer Motion dependency installed. To do this run `npm install framer-motion` in your project directory. Once that's good to go, you'll import it into your `nav.js` file.

```jsx
// nav.js
import React from 'react';
import { motion, useViewportScroll } from "framer-motion"; /** import framer-motion **/

...

export default function Nav() {
  return (
    <motion.nav /** add 'motion.' prefix to 'nav' **/ ... >
      ...
    </motion.nav>
  );
}
```

Now we're going to use the `useViewportScroll` hook from framer-motion to get the scroll y-axis value. We'll also be using the react `useEffect` hook to fire an `onChange` callback for the `scrollY` value updating. We'll just use a console log to see if this is working.

```jsx
// nav.js
...

export default function Nav() {
  const { scrollY } = useViewportScroll(); /** add this bit **/

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

This means the hooks are working and now we can make those hooks trigger some state. W

```jsx
// nav.js
...

export default function Nav() {
  ...
  const [hidden, setHidden] = React.useState(false); /** add useState hook to manage state **/

  /** this onUpdate function will be called in the `scrollY.onChange` callback **/
  function update() {
    if (scrollY.current > scrollY.prev) {
      setHidden(true);
      console.log("hidden");
    } else if (scrollY.current < scrollY.prev) {
      setHidden(false);
      console.log("visible");
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

Now if you look in your console, you should see "visible" and "hidden" events firing everytime you scroll up and down.

### Hooking it all up

Now we're going to interpret those states into animated states using a framer-motion method called `variants`, where all you need to do is indicate the styles that you want for a given state. Once you plug in this code you should be excited to see this working!

```jsx
// nav.js
...

export default function Nav() {
  ...

  /** add this const **/
  const variants = {
    /** this is the "visible" key and it's correlating styles **/
    visible: { opacity: 1, y: 0 },
    /** this is the "hidden" key and it's correlating styles **/
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

And that's all folks, check out the result below or see the full example on [CodeSandbox](https://codesandbox.io/s/framer-motion-nav-show-hide-article-version-omnnd?file=/src/nav.js). What we have here is a super simple method for showing and hiding nav elements based on scroll. You can even get more creative with the animation method by adding more properties to the variants object.

<iframe src="https://codesandbox.io/embed/framer-motion-nav-show-hide-article-version-omnnd?autoresize=1&fontsize=12&module=%2Fsrc%2Fnav.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Framer Motion Nav Show Hide (Article Version)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

—

Thanks for reading!
