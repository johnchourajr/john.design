---
title: Home
header: white
order: 1
contact: mailto:hi@john.design?Subject=Hello%21&Body=Was%20looking%20at%20your%20website%20and%20wanted%20to%20say%20hello%21
layout: default
hello: |
  <a href="#" class="txt" data-txt="🙌">John Choura Jr.</a> is a <a href="#" class="txt" data-txt="😁">Designer</a>, <a href="#" class="txt" data-txt="😬">Developer</a>, <a href="#" class="txt" data-txt="😵">Artist</a>, and <a href="#" class="txt" data-txt="☕️">Craft Coffee</a> drinker in <a href="#" class="txt" data-txt="☀️">Long Beach</a>, California.
work: |
  Currently Leading Product Design at <a href="http://happymoney.com" class="txt" data-txt="🎈">Happy Money</a>. Occasional Adjunct Design Professor at <a href="https://www.biola.edu/art" class="txt" data-txt="👨‍🏫">Biola University.</a> <del>Previously at Envoy, Signal, and Biola.</del>
---

<section class="slide page-header xs-mt6 xs-pt6 vh_90 display-flex align-items-center" data-background="rgb(238, 238, 238)">
  <div class="page-header--upper inline-table wrapper xs-pb6">
      <div class="col md-col-12">
        <h1 class="display-1 text-black">
          {{ page.hello }}
        </h1>
      </div>
  </div>
</section>
<section class="slide page-header vh_90 display-flex align-items-center" data-background="rgba(236,255,254,1)">
  <div class="page-header--upper inline-table wrapper xs-pb6">
      <div class="col md-col-12">
        <h1 class="display-1 text-black">
          {{ page.work }}
        </h1>
      </div>
  </div>
</section>
<section class="slide page-header vh_90 display-flex align-items-center" data-background="rgba(255,254,236,1)">
  <div class="page-header--upper inline-table wrapper xs-pb6">
      <div class="col md-col-12">
        <h1 class="display-1 text-black">Say <a href="{{ page.contact }}" class="txt" data-txt="👋">Hello</a>, or follow me on <a href="{{ site.twitter }}" class="txt" data-txt="twitter">Twitter</a>, <a href="{{ site.dribbble }}" class="txt" data-txt="dribbble">Dribbble</a>, <a href="{{ site.instagram }}" class="txt" data-txt="instagram">Instagram</a>, and <a href="{{ site.github }}" class="txt" data-txt="github">Github</a>.</h1>
      </div>
  </div>
</section>
<section class="slide" data-background="rgb(238, 238, 238)">
  {% include home/most-recent-post.html %}
</section>

<script type="text/javascript">
var preload_images = [
  '/img/home/me-hero.jpg',
];

for (var i = 0, len = preload_images.length; i < len; i++) {
  new Image().src = preload_images[i];
}
</script>
