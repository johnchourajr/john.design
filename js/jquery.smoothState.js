! function($, t, n, o) {
    "use strict";
    if (!t.history.pushState) return $.fn.smoothState = function() {
        return this
    }, void($.fn.smoothState.options = {});
    if (!$.fn.smoothState) {
        var e = $("html, body"),
            r = t.console || !1,
            a = {
                anchors: "a",
                prefetch: !1,
                blacklist: ".no-smoothstate, [target]",
                development: !1,
                pageCacheSize: 0,
                alterRequestUrl: function(t) {
                    return t
                },
                onStart: {
                    duration: 0,
                    render: function() {
                        e.scrollTop(0)
                    }
                },
                onProgress: {
                    duration: 0,
                    render: function() {
                        e.css("cursor", "wait"), e.find("a").css("cursor", "wait")
                    }
                },
                onEnd: {
                    duration: 0,
                    render: function(t, n, o) {
                        e.css("cursor", "auto"), e.find("a").css("cursor", "auto"), n.html(o)
                    }
                },
                callback: function() {}
            }, i = {
                isExternal: function(n) {
                    var o = n.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
                    return "string" == typeof o[1] && o[1].length > 0 && o[1].toLowerCase() !== t.location.protocol ? !0 : "string" == typeof o[2] && o[2].length > 0 && o[2].replace(new RegExp(":(" + {
                        "http:": 80,
                        "https:": 443
                    }[t.location.protocol] + ")?$"), "") !== t.location.host ? !0 : !1
                },
                isHash: function(n, o) {
                    o = o || t.location.href;
                    var e = n.indexOf("#") > -1 ? !0 : !1,
                        r = n.replace(/#.*/, "") === o.replace(/#.*/, "") ? !0 : !1;
                    return e && r
                },
                shouldLoad: function(t, n) {
                    var o = t.prop("href");
                    return !i.isExternal(o) && !i.isHash(o) && !t.is(n)
                },
                htmlDoc: function(t) {
                    var n, o = $(),
                        e = /<(\/?)(html|head|body|title|base|meta)(\s+[^>]*)?>/gi,
                        r = "ss" + Math.round(1e5 * Math.random()),
                        a = t.replace(e, function(t, n, e, a) {
                            var i = {};
                            return n || ($.merge(o, $("<" + e + "/>")), a && $.each($("<div" + a + "/>")[0].attributes, function(t, n) {
                                i[n.name] = n.value
                            }), o.eq(-1).attr(i)), "<" + n + "div" + (n ? "" : ' id="' + r + (o.length - 1) + '"') + ">"
                        });
                    return o.length ? (n || (n = $("<div/>")), n.html(a), $.each(o, function(t) {
                        var e = n.find("#" + r + t).before(o[t]);
                        o.eq(t).html(e.contents()), e.remove()
                    }), n.children().unwrap()) : $(t)
                },
                clearIfOverCapacity: function(t, n) {
                    return Object.keys || (Object.keys = function(t) {
                        var n = [],
                            o;
                        for (o in t) Object.prototype.hasOwnProperty.call(t, o) && n.push(o);
                        return n
                    }), Object.keys(t).length > n && (t = {}), t
                },
                getContentById: function(t, n) {
                    n = n instanceof jQuery ? n : i.htmlDoc(n);
                    var o = n.find(t),
                        e = o.length ? $.trim(o.html()) : n.filter(t).html(),
                        r = e.length ? $(e) : null;
                    return r
                },
                storePageIn: function(t, n, o) {
                    return o = o instanceof jQuery ? o : i.htmlDoc(o), t[n] = {
                        status: "loaded",
                        title: o.find("title").text(),
                        html: o
                    }, t
                },
                triggerAllAnimationEndEvent: function(t, n) {
                    n = " " + n || "";
                    var o = 0,
                        e = "animationstart webkitAnimationStart oanimationstart MSAnimationStart",
                        r = "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
                        a = "allanimationend",
                        s = function(n) {
                            $(n.delegateTarget).is(t) && (n.stopPropagation(), o++)
                        }, c = function(n) {
                            $(n.delegateTarget).is(t) && (n.stopPropagation(), o--, 0 === o && t.trigger(a))
                        };
                    t.on(e, s), t.on(r, c), t.on("allanimationend" + n, function() {
                        o = 0, i.redraw(t)
                    })
                },
                redraw: function(t) {
                    t.height()
                }
            }, s = function(n) {
                if (null !== n.state) {
                    var o = t.location.href,
                        e = $("#" + n.state.id),
                        r = e.data("smoothState");
                    r.href === o || i.isHash(o, r.href) || r.load(o, !0)
                }
            }, c = function(o, e) {
                var a = $(o),
                    s = {}, c = t.location.href,
                    l = function(t, n) {
                        if (n = n || null, !s.hasOwnProperty(t)) {
                            s = i.clearIfOverCapacity(s, e.pageCacheSize), s[t] = {
                                status: "fetching"
                            };
                            var o = e.alterRequestUrl(t) || t,
                                r = $.ajax(o, {
                                    dataType: "html"
                                });
                            r.success(function(n) {
                                i.storePageIn(s, t, n), a.data("smoothState").cache = s
                            }), r.error(function() {
                                s[t].status = "error"
                            }), n && r.complete(n)
                        }
                    }, u = function(o) {
                        var c = "#" + a.prop("id"),
                            l = s[o] ? i.getContentById(c, s[o].html) : null;
                        l ? (n.title = s[o].title, a.data("smoothState").href = o, e.onEnd.render(o, a, l, s[o].html), a.one("ss.onEndEnd", function() {
                            e.callback(o, a, l, s[o].html)
                        }), t.setTimeout(function() {
                            a.trigger("ss.onEndEnd")
                        }, e.onEnd.duration)) : !l && e.development && r ? r.warn("No element with an id of " + c + " in response from " + o + " in " + s) : t.location = o
                    }, d = function(n, o) {
                        o = o || !1;
                        var i = !1,
                            c = !1,
                            d = {
                                loaded: function() {
                                    var e = i ? "ss.onProgressEnd" : "ss.onStartEnd";
                                    c && i ? c && u(n) : a.one(e, function() {
                                        u(n)
                                    }), o || t.history.pushState({
                                        id: a.prop("id")
                                    }, s[n].title, n)
                                },
                                fetching: function() {
                                    i || (i = !0, a.one("ss.onStartEnd", function() {
                                        e.onProgress.render(n, a, null), t.setTimeout(function() {
                                            a.trigger("ss.onProgressEnd"), c = !0
                                        }, e.onStart.duration)
                                    })), t.setTimeout(function() {
                                        s.hasOwnProperty(n) && d[s[n].status]()
                                    }, 10)
                                },
                                error: function() {
                                    e.development && r ? r.log("There was an error loading: " + n) : t.location = n
                                }
                            };
                        s.hasOwnProperty(n) || l(n), e.onStart.render(n, a, null), t.setTimeout(function() {
                            a.trigger("ss.onStartEnd")
                        }, e.onStart.duration), d[s[n].status]()
                    }, h = function(t) {
                        var n = $(t.currentTarget),
                            o = n.prop("href");
                        i.shouldLoad(n, e.blacklist) && (t.stopPropagation(), l(o))
                    }, f = function(t) {
                        var n = $(t.currentTarget),
                            o = n.prop("href");
                        t.metaKey || t.ctrlKey || !i.shouldLoad(n, e.blacklist) || (t.stopPropagation(), t.preventDefault(), d(o))
                    }, m = function(t) {
                        t.on("click", e.anchors, f), e.prefetch && t.on("mouseover touchstart", e.anchors, h)
                    }, p = function(n) {
                        var o = a.addClass(n).prop("class");
                        a.removeClass(o), t.setTimeout(function() {
                            a.addClass(o)
                        }, 0), a.one("ss.onStartEnd ss.onProgressEnd ss.onEndEnd", function() {
                            a.removeClass(n)
                        })
                    }, g = function() {
                        var t = a.prop("class");
                        a.removeClass(t), i.redraw(a), a.addClass(t)
                    };
                return e = $.extend({}, $.fn.smoothState.options, e), null === t.history.state && t.history.replaceState({
                    id: a.prop("id")
                }, n.title, c), i.storePageIn(s, c, n.documentElement.outerHTML), i.triggerAllAnimationEndEvent(a, "ss.onStartEnd ss.onProgressEnd ss.onEndEnd"), m(a), {
                    href: c,
                    cache: s,
                    load: d,
                    fetch: l,
                    toggleAnimationClass: p,
                    restartCSSAnimations: g
                }
            }, l = function(t) {
                return this.each(function() {
                    this.id && !$.data(this, "smoothState") ? $.data(this, "smoothState", new c(this, t)) : !this.id && r && r.warn("Every smoothState container needs an id but the following one does not have one:", this)
                })
            };
        t.onpopstate = s, $.smoothStateUtility = i, $.fn.smoothState = l, $.fn.smoothState.options = a
    }
}(jQuery, window, document);
