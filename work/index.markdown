---
title: Work
header: white
weight: 2
headline: Work
clients:
- name: Joy Money App
  role: Product Design Lead
  link: http://findjoy.com/
  year: 2016-Present
  img: joy-hero.jpg
  data: joy
- name: Arcade Coffee Roasters
  role: Brand/Identity Design
  link: http://arcadecoffeeroasters.com
  year: 2018
  img: arcade-hero.jpg
  data: arcade
- name: Fermensch Kombucha
  role: Brand/Identity Design
  link: http://fermensch.com
  year: 2017
  img: fermensch-hero.jpg
  data: fermensch
- name: Grand Food & Beverage
  role: Creative/Tech Director
  link: http://grandfandb.com
  year: 2016
  img: grandfandb-hero.jpg
  data: grandfandb
- name: Amazing Grass
  role: Logo/Packaging Design
  link: http://amazinggrass.com
  year: 2015
  img: amazinggrass-hero.jpg
  data: amazinggrass
- name: Vizio
  role: Product Designer
  link: http://vizio.com
  year: 2015
  img: vizio-hero.jpg
  data: vizio
- name: Kareo
  role: Art Director
  link: http://kareo.com
  year: 2015
  img: kareo-hero.jpg
  data: kareo
- name: Blossom
  role: 'Brand Designer '
  link: http://getblossom.com
  year: 2015
  img: blossom-hero.jpg
  data: blossom
- name: Biola University
  role: Art Director/Logo Designer
  link: http://biola.edu
  year: 2014
  img: biola-hero.jpg
  data: biola
projects:
- name: Fart Sounds Podcast
  desc: A fun little podcast by John Choura Jr. where people talk about their favorite
    fart sounds.
  year: 2017
  link: http://fartsounds.show
  img: fartsounds-hero.jpg
  data: fartsounds
- name: So. Cal. Craft Coffee
  desc: A hand selected list of the best craft coffee in Southern California.
  year: 2016
  link: http://socal.coffee
  img: socalcoffee-hero.jpg
  data: socalcoffee
- name: A Good Pair
  desc: A Husband and Wife's curated journal of complementary food and drink pairings.
  year: 2015
  link: http://agoodpair.com
  img: agoodpair-hero.jpg
  data: agoodpair
layout: default
---

{% include globals/page-header.html %}

<section class="page-body">
  <div class="post-content wrapper xs-mt3">
      <div class="xs-block gutters">
        <div class="col xs-col-12">
          <h4 class="xs-mt3 xs-mb6 xs-pr1 xs-inline-block">Select Projects</h4>
        </div>

        {% for item in page.clients %}
          <div class="col xs-col-12 md-col-6 lg-col-4 xs-mb4 xs-mt3 xs-inline-block client-col">
            <h2 class="xs-mb2 xs-pr6 txt" data-txt="{{item.data}}"><a href="{{item.link}}">{{item.name}}</a></h2>
            <h4 class="-xs-pr6">{{item.role}}</h4>
          </div>
        {% endfor %}
      </div>
  </div>
</section>

<section class="page-body">
  <div class="post-content wrapper xs-mt3">
      <div class="xs-block gutters">
        <div class="col xs-col-12 xs-mb4">
          <div class="xs-col-12 xs-overflow-hidden line-span">
            <h4 class="xs-mt6 xs-mb3 xs-pr1 xs-inline-block">Personal Projects</h4>
          </div>
        </div>
        {% for item in page.projects %}
          <div class="col xs-col-12 xs-mb3 xs-mt6 xs-block ">
            <div class="">
              <h6>{{item.year}}</h6>
              <div class="col md-col-6 lg-col-5 xs-mb3 xs-pr6 project-col txt" data-txt="{{item.data}}">
                <h2 class="xs-mb2"><a href="{{item.link}}">{{item.name}}</a></h2>
                <h5><a href="{{item.link}}">Visit Site</a></h5>
              </div>
              <p class="col md-col-5 lg-col-5 xs-pb2">{{item.desc}}</p>
            </div>
          </div>
        {% endfor %}
      </div>
  </div>
</section>

<section class="page-body">
  <div class="post-content wrapper xs-mb6">
      <div class="xs-block gutters">
        <div class="col xs-col-12 xs-mb4">
          <div class="xs-col-12 xs-overflow-hidden line-span">
            <h4 class="xs-mt6 xs-mb3 xs-pr1 xs-inline-block"><a href="http://dribbble.com/johnchourajr">Recent Dribbble Shots</a></h4>
          </div>
        </div>
      </div>
  </div>
</section>

<div class="shots"></div>

<script type="text/javascript">

{% comment %}
  https://fish-roll.glitch.me/
  https://glitch.com/edit/#!/fish-roll?path=README.md:1:0
{% endcomment %}

jribbble.setToken("7e7b1c2be2b0462dc24d1b553439eaf0f9200e28fc74a2da77a3b72e3ac1ed75");

jribbble.shots(
  {'per_page': 24,},
  function(shots) {
    console.log(shots);
    document.querySelector(".shots").innerHTML = shots.reduce(
      function(html, shot) {
        if (!shot.low_profile) {
          return html + `<span class="shots--shot"><a href="${shot.html_url}" target="_blank"><img src="${shot.images.hidpi}"></a></span>`;
        } else return html + ``
      }
    , "");
  }
);

</script>
