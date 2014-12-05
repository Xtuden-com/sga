// Generated by CoffeeScript 1.7.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.SGAsearch = {};

  (function($, SGAsearch, _, Backbone) {
    $.param.fragment.noEscape(':,/');
    SGAsearch.SearchResult = (function(_super) {
      __extends(SearchResult, _super);

      function SearchResult() {
        return SearchResult.__super__.constructor.apply(this, arguments);
      }

      SearchResult.prototype.defaults = {
        "hls": [],
        "id": "",
        "shelfmark": "",
        "work": "",
        "authors": "",
        "viewer_url": "",
        "imageURL": "http://placehold.it/75x100",
        "detailQuery": ""
      };

      return SearchResult;

    })(Backbone.Model);
    SGAsearch.Facet = (function(_super) {
      __extends(Facet, _super);

      function Facet() {
        return Facet.__super__.constructor.apply(this, arguments);
      }

      Facet.prototype.defaults = {
        "type": "",
        "field": "",
        "name": "",
        "num": 0
      };

      return Facet;

    })(Backbone.Model);
    SGAsearch.Pages = (function(_super) {
      __extends(Pages, _super);

      function Pages() {
        return Pages.__super__.constructor.apply(this, arguments);
      }

      Pages.prototype.defaults = {
        "first": "disabled",
        "prev": "disabled",
        "next": "disabled",
        "last": "disabled",
        "pages": 1,
        "current": 1
      };

      return Pages;

    })(Backbone.Model);
    SGAsearch.SearchResultList = (function(_super) {
      __extends(SearchResultList, _super);

      function SearchResultList() {
        return SearchResultList.__super__.constructor.apply(this, arguments);
      }

      SearchResultList.prototype.model = SGAsearch.SearchResult;

      return SearchResultList;

    })(Backbone.Collection);
    SGAsearch.Facetlist = (function(_super) {
      __extends(Facetlist, _super);

      function Facetlist() {
        return Facetlist.__super__.constructor.apply(this, arguments);
      }

      Facetlist.prototype.model = SGAsearch.Facet;

      return Facetlist;

    })(Backbone.Collection);
    SGAsearch.PagesView = (function(_super) {
      __extends(PagesView, _super);

      function PagesView() {
        return PagesView.__super__.constructor.apply(this, arguments);
      }

      PagesView.prototype.template = _.template($('#pagi-template').html());

      PagesView.prototype.initialize = function() {
        this.listenTo(this.model, 'change', this.render);
        return this.listenTo(this.model, 'destroy', this.remove);
      };

      PagesView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      PagesView.prototype.remove = function() {
        this.$el.remove();
        return this;
      };

      return PagesView;

    })(Backbone.View);
    SGAsearch.SearchResultListView = (function(_super) {
      __extends(SearchResultListView, _super);

      function SearchResultListView() {
        this.addOne = __bind(this.addOne, this);
        return SearchResultListView.__super__.constructor.apply(this, arguments);
      }

      SearchResultListView.prototype.target = null;

      SearchResultListView.prototype.render = function(dest) {
        this.target = dest;
        this.collection.each(this.addOne, this);
        return this;
      };

      SearchResultListView.prototype.addOne = function(model) {
        var view;
        view = new SGAsearch.SearchResultView({
          model: model
        });
        return $(this.target).append(view.render().$el);
      };

      SearchResultListView.prototype.clear = function() {
        return this.collection.each(function(m) {
          return m.trigger('destroy');
        });
      };

      return SearchResultListView;

    })(Backbone.View);
    SGAsearch.SearchResultView = (function(_super) {
      __extends(SearchResultView, _super);

      function SearchResultView() {
        return SearchResultView.__super__.constructor.apply(this, arguments);
      }

      SearchResultView.prototype.template = _.template($('#result-template').html());

      SearchResultView.prototype.initialize = function() {
        this.listenTo(this.model, 'change', this.render);
        return this.listenTo(this.model, 'destroy', this.remove);
      };

      SearchResultView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      SearchResultView.prototype.remove = function() {
        this.$el.remove();
        return this;
      };

      return SearchResultView;

    })(Backbone.View);
    SGAsearch.FacetListView = (function(_super) {
      __extends(FacetListView, _super);

      function FacetListView() {
        return FacetListView.__super__.constructor.apply(this, arguments);
      }

      FacetListView.prototype.target = null;

      FacetListView.prototype.render = function(dest, o) {
        this.target = dest;
        this.collection.each((function(m) {
          return this.addOne(m, o);
        }), this);
        return this;
      };

      FacetListView.prototype.addOne = function(model, o) {
        var view;
        view = new SGAsearch.FacetView({
          model: model
        });
        $(this.target).find('.list-group').append(view.render().$el);
        return this.bindFacetControls(view, o);
      };

      FacetListView.prototype.bindFacetControls = function(view, o) {
        view.$el.click(function(e) {
          e.preventDefault();
          if (view.model.attributes.type === 'notebook') {
            o.filters = "shelfmark:%22" + view.model.attributes.name + "%22";
          } else {
            o.fields += "," + view.model.attributes.field;
          }
          return SGAsearch.search(o.service, o.query, o.facets, o.destination, o.fields, 0, o.filters);
        });
        return view.$el.find('span.label-danger').click(function(e) {
          var f;
          e.preventDefault();
          e.stopPropagation();
          if (view.model.attributes.type === 'notebook') {
            f = "NOT%20shelfmark:%22" + view.model.attributes.name + "%22";
            if (o.filters == null) {
              o.filters = f;
            } else {
              o.filters += "," + f;
            }
          } else {
            o.fields += ",NOT%20" + view.model.attributes.field;
          }
          return SGAsearch.search(o.service, o.query, o.facets, o.destination, o.fields, 0, o.filters);
        });
      };

      FacetListView.prototype.clear = function() {
        return this.collection.each(function(m) {
          return m.trigger('destroy');
        });
      };

      return FacetListView;

    })(Backbone.View);
    SGAsearch.FacetView = (function(_super) {
      __extends(FacetView, _super);

      function FacetView() {
        return FacetView.__super__.constructor.apply(this, arguments);
      }

      FacetView.prototype.template = _.template($('#facet-template').html());

      FacetView.prototype.initialize = function() {
        this.listenTo(this.model, 'change', this.render);
        return this.listenTo(this.model, 'destroy', this.remove);
      };

      FacetView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      FacetView.prototype.remove = function() {
        this.$el.remove();
        return this;
      };

      return FacetView;

    })(Backbone.View);
    SGAsearch.updateSearch = function(service, facets, destination) {
      var doSearch;
      doSearch = function() {
        var f, nb, p, q;
        q = $.bbq.getState('q');
        f = $.bbq.getState('f');
        p = $.bbq.getState('p');
        nb = $.bbq.getState('nb');
        if ((q != null) && (f != null)) {
          if (p == null) {
            p = 0;
          } else {
            p -= 1;
          }
          if (nb == null) {
            nb = null;
          }
          SGAsearch.search(service, q, facets, destination, f, p, nb);
          return $('#all-results').show();
        }
      };
      doSearch();
      return $(window).bind("hashchange", function(e) {
        return doSearch();
      });
    };
    return SGAsearch.search = function(service, query, facets, destination, fields, page, filters, sort) {
      var bindPagination, bindSort, setHistory, srcOptions, updateResults, url;
      if (fields == null) {
        fields = 'text';
      }
      if (page == null) {
        page = 0;
      }
      if (filters == null) {
        filters = null;
      }
      if (sort == null) {
        sort = null;
      }
      srcOptions = {
        service: service,
        fields: fields,
        query: query,
        facets: facets,
        destination: destination,
        page: page,
        filters: filters,
        srt: sort
      };
      if (this.srlv != null) {
        this.srlv.clear();
      }
      this.srl = new SGAsearch.SearchResultList();
      this.srlv = new SGAsearch.SearchResultListView({
        collection: this.srl
      });
      url = "" + service + "?q=" + query + "&f=" + fields;
      if (filters != null) {
        url += "&filters=" + filters;
      }
      if (page > 0) {
        url += "&s=" + (page * 20);
      }
      if (sort != null) {
        url += "&sort=" + sort;
      }
      setHistory = function() {
        return $.bbq.pushState({
          f: fields,
          q: query
        });
      };
      bindSort = function() {
        var order, sortBy, sortSearch;
        sortBy = $(".r-sorting").find('[name=r-sortby]');
        order = $(".r-sorting").find('[name=r-sort]');
        sortSearch = function() {
          var o, ov, sv;
          sv = sortBy.val();
          ov = order.val();
          o = srcOptions;
          o.srt = "" + sv + "%20" + ov + ",id%20" + ov;
          return SGAsearch.search(o.service, o.query, o.facets, o.destination, o.fields, o.page, o.filters, o.srt);
        };
        sortBy.change(function() {
          return sortSearch();
        });
        return order.change(function() {
          return sortSearch();
        });
      };
      bindPagination = function(tot) {
        var current, first, last, next, pages, pagi, prev, view;
        pages = Math.ceil(tot / 20);
        pagi = new SGAsearch.Pages();
        current = page + 1;
        first = "disabled";
        prev = "disabled";
        next = "disabled";
        last = "disabled";
        if (current > 1) {
          first = "";
          prev = "";
        }
        if (current < pages) {
          next = "";
          last = "";
        }
        pagi.set({
          "first": first,
          "prev": prev,
          "next": next,
          "last": last,
          "pages": pages,
          "current": current
        });
        view = new SGAsearch.PagesView({
          model: pagi
        });
        view.setElement($(".pagination-sm"));
        view.render().$el;
        view.$el.find('a:not(.dots)').each(function(i, el) {
          return $(el).click(function(ev) {
            var btn, o;
            ev.preventDefault();
            o = srcOptions;
            btn = $(this);
            o.page = (function() {
              switch (false) {
                case !btn.hasClass('nav-first'):
                  return 0;
                case !btn.hasClass('nav-prev'):
                  return current - 2;
                case !btn.hasClass('nav-next'):
                  return current;
                case !btn.hasClass('nav-last'):
                  return pages - 1;
                default:
                  return btn.attr("name") - 1;
              }
            })();
            return SGAsearch.search(o.service, o.query, o.facets, o.destination, o.fields, o.page, o.filters);
          });
        });
        return view.$el.find('.nav-first');
      };
      setHistory = function() {
        var cur_f, cur_nb, cur_p, cur_q;
        cur_q = $.bbq.getState('q');
        cur_f = $.bbq.getState('f');
        cur_p = $.bbq.getState('p');
        cur_nb = parseInt($.bbq.getState('nb') - 1);
        if (cur_q !== query || cur_f !== fields) {
          $.bbq.pushState({
            q: query,
            f: fields
          });
        }
        if (cur_p !== page) {
          if (page > 0) {
            $.bbq.pushState({
              p: page + 1
            });
          } else {
            $.bbq.removeState('p');
          }
        }
        if (cur_nb !== filters) {
          if (filters != null) {
            return $.bbq.pushState({
              nb: filters
            });
          } else {
            return $.bbq.removeState('nb');
          }
        }
      };
      updateResults = (function(_this) {
        return function(res) {
          var f_add, f_del, f_h_mws, f_h_pbs, f_nb, k, nb, orderedNBs, orig_id, r, sr, v, _i, _j, _len, _len1, _ref;
          $(".num-results .badge").show().text(res.numFound);
          $("#usr-msg").hide();
          if (res.numFound === 0) {
            $("#usr-msg").show().find('span').text("No results found.");
          }
          _ref = res.results;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            r = _ref[_i];
            sr = new SGAsearch.SearchResult();
            _this.srlv.collection.add(sr);
            orig_id = r.id;
            r.num = (res.results.indexOf(r) + 1) + page * 20;
            r.id = r.id.substr(r.id.length - 4);
            r.imageURL = "http://tiles2.bodleian.ox.ac.uk:8080/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=http://shelleygodwinarchive.org/images/ox/" + orig_id + ".jp2&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/jpeg&svc.level=0&svc.region=0,0,100,75";
            r.detailQuery = "/search/f:" + fields + "|q:" + query;
            sr.set(r);
          }
          _this.srlv.render(destination);
          if (_this.nb_flv != null) {
            _this.nb_flv.clear();
          }
          _this.nb_fl = new SGAsearch.Facetlist();
          _this.nb_flv = new SGAsearch.FacetListView({
            collection: _this.nb_fl
          });
          orderedNBs = ((function() {
            var _ref1, _results;
            _ref1 = res.facets.notebooks;
            _results = [];
            for (k in _ref1) {
              v = _ref1[k];
              _results.push([k, v]);
            }
            return _results;
          })()).sort(function(a, b) {
            return b[1] - a[1];
          }).map(function(n) {
            return n[0];
          });
          for (_j = 0, _len1 = orderedNBs.length; _j < _len1; _j++) {
            nb = orderedNBs[_j];
            f_nb = new SGAsearch.Facet();
            _this.nb_flv.collection.add(f_nb);
            f_nb.set({
              "type": "notebook",
              "field": "shelfmark",
              "name": nb,
              "num": res.facets.notebooks[nb]
            });
          }
          _this.nb_flv.render($(facets).find('#r-list-notebook'), srcOptions);
          if (_this.h_flv != null) {
            _this.h_flv.clear();
          }
          _this.h_fl = new SGAsearch.Facetlist();
          _this.h_flv = new SGAsearch.FacetListView({
            collection: _this.h_fl
          });
          if (parseInt(res.facets.hand_mws) > 0) {
            f_h_mws = new SGAsearch.Facet();
            _this.h_flv.collection.add(f_h_mws);
            f_h_mws.set({
              "type": "hand",
              "field": "hand_mws",
              "name": "Mary Shelley",
              "num": res.facets.hand_mws
            });
          }
          if (parseInt(res.facets.hand_pbs) > 0) {
            f_h_pbs = new SGAsearch.Facet();
            _this.h_flv.collection.add(f_h_pbs);
            f_h_pbs.set({
              "type": "hand",
              "field": "hand_pbs",
              "name": "Percy Bysshe Shelley",
              "num": res.facets.hand_pbs
            });
          }
          _this.h_flv.render($(facets).find('#r-list-hand'), srcOptions);
          if (_this.r_flv != null) {
            _this.r_flv.clear();
          }
          _this.r_fl = new SGAsearch.Facetlist();
          _this.r_flv = new SGAsearch.FacetListView({
            collection: _this.r_fl
          });
          if (parseInt(res.facets.added) > 0) {
            f_add = new SGAsearch.Facet();
            _this.r_flv.collection.add(f_add);
            f_add.set({
              "type": "rev",
              "field": "added",
              "name": "Added Passages",
              "num": res.facets.added
            });
          }
          if (parseInt(res.facets.deleted) > 0) {
            f_del = new SGAsearch.Facet();
            _this.r_flv.collection.add(f_del);
            f_del.set({
              "type": "rev",
              "field": "deleted",
              "name": "Deleted Passages",
              "num": res.facets.deleted
            });
          }
          _this.r_flv.render($(facets).find('#r-list-rev'), srcOptions);
          bindPagination(res.numFound);
          bindSort();
          setHistory();
          return setHistory();
        };
      })(this);
      return $.ajax({
        url: url,
        type: 'GET',
        processData: false,
        success: updateResults,
        error: function() {
          return $("#usr-msg").show().find('span').toggleClass('alert-info alert-danger').text('Could not reach server. Please try again later.');
        }
      });
    };
  })(jQuery, window.SGAsearch, _, Backbone);

}).call(this);
