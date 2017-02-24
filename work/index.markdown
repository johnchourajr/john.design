---
title: Work
layout: default
header: white
weight: 2
headline: Work
clients:
- name: Arcade Coffee Roasters
  role: Brand/Identity Design
  link: http://arcadecoffeeroasters.com
  year: 2017
- name: Steelhead Coffee
  role: Graphic Designer
  link: http://steelheadcoffee.com/
  year: 2016
- name: Grand Food & Beverage
  role: Creative/Tech Director
  link: http://grandfandb.com
  year: 2016
- name: Amazing Grass
  role: Logo/Packaging Design
  link: http://amazinggrass.com
  year: 2015
- name: Vizio
  role: Product Designer
  link: http://vizio.com
  year: 2015
- name: Kareo
  role: Art Director
  link: http://kareo.com
  year: 2015
- name: Blossom
  role: Designer
  link: http://getblossom.com
  year: 2015
- name: Biola University
  role: Designer
  link: http://biola.edu
  year: 2014
projects:
- name: So. Cal. Craft Coffee
  link: http://socal.coffee
---

{% include globals/page-header.html %}

<section class="page-body">
  <div class="post-content wrapper xs-mb6">
      <div class="xs-block gutters">
          <div class="col xs-col-12">
            <h4 class="xs-mt3 xs-mb2 xs-pr1 xs-inline-block">Recent Work</h4>
          </div>
      </div>
  </div>
</section>

<div class="shots"></div>

<section class="page-body">
  <div class="post-content wrapper xs-mt3">
      <div class="xs-block gutters">
        <div class="col xs-col-12 xs-mb4">
          <div class="xs-col-12 xs-overflow-hidden line-span">
            <h4 class="xs-mt6 xs-mb3 xs-pr1 xs-inline-block">Client List</h4>
          </div>
        </div>
        {% for item in page.clients %}
          <div class="col xs-col-12 md-col-6 lg-col-4 xs-mb4 xs-mt3 xs-inline-block">
            <h2 class="xs-mb2 xs-pr6"><a href="{{item.link}}">{{item.name}}</a></h2>
            <h4 class="-xs-pr6">{{item.role}}</h4>
          </div>
        {% endfor %}
      </div>
  </div>
</section>

<script type="text/javascript">
  $.jribbble.setToken('ddb8861ee535f012c39ce85126a6e6987b245585883bb591390360f48def34d7');

  $.jribbble.users('johnchourajr').shots({per_page: 14}).then(function(shots) {
    var html = [];

    shots.forEach(function(shot) {
      html.push('<span class="shots--shot">');
      html.push('<a href="' + shot.html_url + '" target="_blank">');
      html.push('<img src="' + shot.images.hidpi + '">');
      html.push('</a></span>');
    });

    $('.shots').html(html.join(''));
  });
</script>
