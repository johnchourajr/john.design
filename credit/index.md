---
title: Site Credits
header: white
hide: true
headline: Site Credits
technical:
- Hosted and Deployed with [Netlify](https://www.netlify.com/)
- Domains with [Google Domains](https://domains.google/#/)
- Code Managed with [GitHub](https://github.com/) [(View)](https://github.com/johnchourajr/john.design)
- Built with [Jekyll](https://jekyllrb.com/)
- Code Written on [Atom](https://atom.io/)
- CSS Framework with [Solid CSS by Buzzfeed](http://solid.buzzfeed.com/)
- Web Tech [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers),
  [jQuery](https://jquery.com/), [Vanilla Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),
  and [SCSS](http://sass-lang.com/)
- Fonts [Your Native Sans-Serif](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)
  and [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono)
- Nav Show/Hide learned from [here](https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c#.l6t9zfowf)
other:
- I design and build my personal website to reflect on myself and my work. I change
  it all the time, just because I want to.
- I like to write reflections and life notes in my Journal, even if no one reads them.
- All of the gif's on my homepage were created and animated by me. Don't steal.
- "Lastly, special shoutout to emoji's, I even used them when writing some code \U0001F918."
layout: default
---

{% include globals/page-header.html %}

<section class="page-body md-pt6">
  <div class="post-content wrapper xs-mt3">
    <div class="xs-block gutters">
      <div class="col md-col-5">
        <h1>Technical</h1>
        <ul class="xs-mb6">
          {% for item in page.technical %}
            <li><h4 class="text-black xs-mb1">{{ item | markdownify }}</h4></li>
          {% endfor %}
        </ul>
      </div>
      <div class="col md-col-5 md-offset-2">
        <h1>Acknowledgements</h1>
          {% for item in page.other %}
            <h2 class="text-black">
              {{ item }}
            </h2>
          {% endfor %}
      </div>
    </div>
  </div>
</section>