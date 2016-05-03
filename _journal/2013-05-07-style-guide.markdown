---
title: Style Guide
layout: journal
date: 2013-05-07 06:06:00 Z
published: false
color: ''
---

Basic paragraph typography is emblazoned in FF Tisa Web Pro, at a fair size for reading comfortably on a screen. From time-to-time I *italicise text* for rhetorical emphasis, as well as call out certain words with **bold text**.

### Sub-Sections
Second headings break up the content into sub-sections. In the case where I was referring to something or someone outside of myself, I would make a [reference^1](#refer) or a [note^2](#refer) which uses an anchor link `href="#refer"` that directs the reader toward the **References and Notes** section at the bottom of the page. [Hyperlinks](#) are colored and underlined with a lighter gray, and change red on hover.

###### Inline Image Small
![sm](/uploads/proj-sm.jpg)

###### Inline Image Large
![lg](/uploads/proj-lg.jpg)

###### Two Up Inline Images
![twoup](/uploads/proj-sm.jpg)
![twoup](/uploads/proj-sm.jpg)

### Code
```
  <section class="work__hero">
    <header>
      <nav class="grid">
        <ul class="logo grid__col grid__col--1-of-12 grid__col--push-1-of-12">
          <li class="logo__svg"><a href="/"><img src="/img/logo.svg" alt="/"/></a></li>
        </ul>
        <ul class="nav grid__col grid__col--4-of-12 grid__col--push-5-of-12">
        {% for page in site.pages %}
          <li><a class="white" href="{{page.url}}">{{page.title}}</a></li>
        {% endfor %}
        </ul>
      </nav>
    </header>
  </section>
```

### Block Quote
Block quote are an attention grabbing element, not to be over-used, but only in order to compliment the journal post.
> The beige hue on the waters of the loch impressed all, including the French queen, before she heard that symphony again, just as young Arthur wanted. *–Phonetic Panagram*

### List
Rarely will I ever find an opportunity to list anything, but in the case that I do, this is how.
- List item 1
- List item 2
- List item 3

###### Inline Image Extra Small
![xsm](/uploads/proj-sm.jpg)
