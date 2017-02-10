---
title: Site Credits
header: white
hide: true
headline: Site Credits
technical:
- Hosted on [AWS](https://aws.amazon.com/)
- Domains with [Google Domains](https://domains.google/#/)
- Code Managed with [GitHub](https://github.com/) [(View)](https://github.com/johnchourajr/john.design)
- Built with [Jekyll](https://jekyllrb.com/)
- Content Manage with [Siteleaf](https://www.siteleaf.com/)
- Written on [Atom](https://atom.io/)
- CSS Framework with [Solid CSS by Buzzfeed](http://solid.buzzfeed.com/)
- Web Tech [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers),
  [jQuery](https://jquery.com/), [Vanilla Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),
  and [SCSS](http://sass-lang.com/)
- Fonts [Your Native Sans-Serif](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)
  and [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono)
other:
- I design and build my personal website to reflect on myself and my work. I change
  it all the time, just because I want to.
- I like to write reflections and life notes in my Journal, even if no one reads them.
- "The Gif's on the homepage aren't made by me, I just like them \U0001F642."
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
