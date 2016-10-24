---
title: Info
layout: default
header: black
order: 1
headline: 'John Choura Jr. is a designer in Long Beach, California.'
about-1: 'Designing financial products for non-financial types at Payoff. <span class="decoration-line-through">Previously at Envoy, Signal, and Biola.</span>'
about-2: 'I am a designer, in as many senses of the word as possible. Bringing ideas to life for great brands and even better people, across all mediums. I write code, illustrate, push pixels, build products, creative direct, story-tell, shape brands, and make/break grids. I am passionate about leading and working with teams.'
---

<section class="page-header fill-black">
  <div class="page-header--upper wrapper">
    <div class="xs-block gutters">
      <div class="col md-col-8 md-offset-4 lg-col-7 lg-offset-5">
        <h1 id="site-header" class="display text-white">{{ page.headline }}</h1>
      </div>
    </div>
  </div>
  {% include home/shapes.html %}
</section>
<section class="post-body md-pt6">
  <div class="post-content xs-pt6 xs-mt6">
    <div class="wrapper md-pt6 md-mt6">
      <div class="gutters xl-pt6">
        <div class="col col-md-4 lg-col-5">
          <div class="about-shape -shape--sheet-3">
            <img class="about-me" src="{{ "/img/me.jpg" | prepend: site.baseurl }}" alt="" />
          </div>
        </div>
        <div class="col md-col-8 lg-col-7 ">
          <h3 class="md-mt2 md-pr3">About Me</h3>
          <p class="text-1">{{ page.about-1 }}</p>
          <p>{{ page.about-2 }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="post-content">
    <div class="wrapper md-pt6 md-mt6">
      <div class="gutters">
        <div class="col col-md-4 lg-col-4">
          <div class="about-featured">
            <h3 class="md-mt2 md-pr6">Featured On</h3>
            <p class="text-2"><a href="http://www.awwwards.com/sites/grand-food-beverage">Awwwards</a>, <a href="http://www.commarts.com/webpicks/grand-food-beverage">Commarts</a>, <a href="http://www.site.uplabs.com/posts/john-choura-jr-home">SiteUp</a>, <a href="http://thetypefight.com/details/john-choura-vs.-simon-sok">Type Fight</a>, <a href="http://www.underconsideration.com/fpo/archives/2013/07/biola-academic-planner.php">FPO</a>, <a href="">OneMinuteWith</a>, <a href="http://www.urbanoutfitters.com/urban/catalog/productdetail.jsp?id=24772220&color=060&itemdescription=true&navAction=jump&search=true&isProduct=true&parentid=A_FURN_WALL">Urban Outfitters</a>, <a href="http://helpink.org/search?q=John+Choura">Help Ink</a>, <a href="http://fontsinuse.com/uses/2882/change-the-things-i-can">Fonts In Use</a>.</p>
            <hr class="xs-border xs-my6">
            <h3 class="md-mt2 md-pr6">Social</h3>
            <p class="text-2"><a href="http://twitter.com/johnchourajr">Twitter</a>, <a href="http://instagram.com/johnchoura">Instagram</a>, <a href="http://dribbble.com/johnchourajr">Dribbble</a>, <a href="http://github.com/johnchourajr">GitHub</a>.</p>
            <hr class="xs-border xs-my6">
            <h3 class="md-mt2 md-pr6">Say Hello</h3>
            <p class="text-2"><a href="mailto:{{ site.email }}">{{ site.email }}</a></p>
          </div>
        </div>
        <div class="col xs-col-12 lg-col-7 lg-offset-1">
          <div class="about-shape -shape--sheet-1">
            <img class="about-beach" src="{{ "/img/beach.jpg" | prepend: site.baseurl }}" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
  {% include home/most-recent-post.html %}
</section>
