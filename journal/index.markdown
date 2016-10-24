---
title: Journal
layout: page
header: black
weight: 3
---

<section class="page-header fill-black xs-relative">
  <div class="page-header--upper wrapper xs-z4">
    <div class="xs-block gutters">
      <div class="col md-col-8 md-offset-4 lg-col-7 lg-offset-5 xl-col-6">
        <h1 class="display text-white">The Journal of<br>John Choura Jr.</h1>
      </div>
    </div>
  </div>
  <div class="page-header--text xs-absolute" style="left: -73vw;">
    <h1>{{ page.title }}{{ page.title }}{{ page.title }}{{ page.title }}</h1>
  </div>
</section>


<section class="page-body md-pt6">
  <div class="post-content wrapper xs-mt3">
      <div class="xs-block gutters">
        {% for post in site.journal reversed %}
        {% unless post.next %}
          <div class="col xs-col-12">
            <h3 class="xs-mt3 xs-mb2 xs-pr1 xs-inline-block"> Recent Posts </h3>
          </div>
        {% else %}
        {% capture year %}{{ post.date | date: '%Y' }}
        {% endcapture %}
        {% capture nyear %}{{ post.next.date | date: '%Y' }}
        {% endcapture %}
          {% if year != nyear %}
            <div class="col xs-col-12">
              <div class="xs-col-12 xs-overflow-hidden line-span">
                <h3 class="xs-mt6 xs-mb3 xs-pr1 xs-inline-block ">{{ post.date | date: '%Y' }}</h3>
              </div>
            </div>
          {% endif %}
        {% endunless %}

          {% include journal-index.html %}

        {% endfor %}
      </div>
  </div>
</section>
