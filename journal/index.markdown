---
title: Journal
layout: default
header: white
weight: 3
headline: Journal
---

{% include globals/page-header.html %}

<section class="page-body">
  <div class="post-content wrapper xs-mt3">
      <div class="xs-block gutters">
        {% for post in site.journal reversed %}
        {% unless post.next %}
          <div class="col xs-col-12">
            <h4 class="xs-mt3 xs-mb2 xs-pr1 xs-inline-block"> Recent Posts </h4>
          </div>
        {% else %}
        {% capture year %}{{ post.date | date: '%Y' }}
        {% endcapture %}
        {% capture nyear %}{{ post.next.date | date: '%Y' }}
        {% endcapture %}
          {% if year != nyear %}
            <div class="col xs-col-12">
              <div class="xs-col-12 xs-overflow-hidden line-span">
                <h4 class="xs-mt6 xs-mb3 xs-pr1 xs-inline-block ">{{ post.date | date: '%Y' }}</h4>
              </div>
            </div>
          {% endif %}
        {% endunless %}

          {% include journal-index.html %}

        {% endfor %}
      </div>
  </div>
</section>
