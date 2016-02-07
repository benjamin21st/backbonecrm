/* globals define, console */
/**
 * [description]
 * This file contains useful parent classes where developers
 * can use for various different use cases.
 *
 * Rules for adding a new subtype in this file:
 *   1. the candidate object can be abstracted, meaning that the methods are not
 *      exclusively for this very object in one specific use case.
 *   2. the candidate object has (or will) appear(ed) more than twice
 *
 */
define(function (require) {
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone');

  /**
   * [SortableCollection description]
   * Based on Backbone's Collection class, this subtype is extended so that
   * it allows easier sorting with given criteria and order.
   */
  var SortableCollection = Backbone.Collection.extend({
      initialize: function (props) {
        console.log('This is a sortable collection. ');

        for (var key in props) {
          this[key] = props[key];
        }

        this.sortCriteria = null;
        this.sortOrder= 1;
      },
      comparator: function (model1, model2) {
        var value1 = model1.get(this.sortCriteria),
            value2 = model2.get(this.sortCriteria),
            result;

        if (typeof value1 === typeof value2 && typeof value1 === 'string') {
          value1 = value1.toLowerCase();
          value2 = value2.toLowerCase();
        } else if (typeof value1 === typeof value2 && typeof value1 === undefined) {
          value1 = value2 = -Infinity;
        } else if (typeof value1 !== typeof value2) {
          /**
           * If two values are of different types, then return 0 (do nothing)
           */
          return 0;
        }

        if (value1 < value2 ) {
          result = -1;
        } else if (value1 > value2) {
          result = 1;
        } else {
          result = 0;
        }

        return result * (this.sortOrder);
      },
      sortByAttribute: function (attrName, order) {
        this.sortCriteria = attrName;
        this.sortOrder = order;

        this.sort(this.comparator);

        return this;
      }
  });


  /**
   * [SortableTableView description]
   * SortableTableView is extended from Backbone's View class
   * with additional events and methods that captures sorting
   * behaviours from the client
   *
   * @dependencies: {
   *   SortableCollection
   * }
   */
  var SortableTableView = Backbone.View.extend({
    events: {
      'click .SortableHead': 'sortByAttribute',
      'click .LoadMoreData': 'loadMoreData'
    },

    initialize: function () {
      console.log('Initialzed a sortable table view.');
    },

    sortByAttribute: function(e) {
      var target = e.currentTarget,
          isSorting = $(target).hasClass('sorting'),
          attrName = $(target).attr('data-name');

      if (!isSorting) {
        $(target).addClass('sorting');
        this.collection.sortByAttribute(attrName, 1);
      } else {
        if ($(target).hasClass('sort-asc')) {
          $(target).removeClass('sort-asc').addClass('sort-desc');
          this.collection.sortByAttribute(attrName, -1);
        } else if ($(target).hasClass('sort-desc')) {
          $(target).removeClass('sort-desc').addClass('sort-asc');
          this.collection.sortByAttribute(attrName, 1);
        }
      }

      return this.reloadTableData();
    },

    reloadTableData: function () {
      /**
       * [success description]
       * TODO: try not to fetch new data and just render
       *       the view.
       *
       * @param  {[type]} collection) {                                                                       if (options && 'sortBy' in options) {                         var attrName [description]
       * @param  {[type]} error:      function      () {          return _this.reloadView(this.collection);                              }              } [description]
       * @return {[type]}             [description]
       */

      /**
       * TODO:
       *   - make sure sortBy will sort the existing models
       */
      this.reloadView(this.collection);
    },

    reloadView: function (collection) {
      var models = collection.models,
          len = models.length,
          model,
          itemView,
          cachedDom = [];

      for (var  i = 0; i < len; i++) {
        model = models[i].parseDates();
        itemView = new this.childView({model: model});

        cachedDom.push(itemView.el);
      }

      this.$el.find('.table-data').html(cachedDom);

      return this;
    },

    /**
     * [loadMoreData description]
     * This function will load more data from server when
     * a certain event is triggered. I.E. scroll overTop or
     * click a "load more" button.
     *
     * Using the backbone collection.fetch function,
     * this could be implemented as:
     *  - pass 'offset' and 'limit' to the url as params
     *    - collection.fetch({
     *      url: '/data/category/all?limit=10&offset=0'
     *    })
     *    - on server side, return data based on the 'limit'
     *      and 'offset' settings
     *  - the front end sorting should work only on the queried
     *    data, when new data is queried, append to the bottom of
     *    the table, user needs to click their sorting criteria
     *    again to re-sort. Potentially, we could toggle off the
     *    sorting status that is currently in place to signal user
     *    that sorting is currently interrupted.
     *
     *
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    loadMoreData: function (options) {
      var limit, offset, baseURL,
          url = this.collection.url,
          _this = this;

      try {
        limit = parseInt(url.match(/limit=\d+/)[0].match(/\d+/)[0]);
      } catch (e) {
        if (!limit) {
          limit = 10;
        }
      }

      try {
        offset = parseInt(url.match(/offset=\d+/)[0].match(/\d+/)[0]);
        offset += limit;
      } catch (e) {
        if (!offset) {
          offset = 10;
        }
      }

      try {
        baseURL = url.match(/.+\?/)[0] || url;
      } catch (e) {
        baseURL = url + '?';
      }

      /**
       * [url description]
       * this changes the this.collection, so that when we do
       * "fetch" later on there are no models in the collection
       *
       * Solutions:
       *   - maybe in this rload more function, we create
       *   a new collection to perform "fetch" and "append", and then
       *   add al data in this collection to the original
       *   collection.
       *
       *   - Or, not use backbone's "fetch", use standard ajax
       *
       *
       * @type {[type]}
       */

       // TODO: try initialize new baseCollection and set the URL?
       // and remember not to fetch
      this.collection.url = baseURL + 'offset=' + offset + '&limit=' + limit;
      this.newCollection = new this.baseCollection();
      this.newCollection.url = this.collection.url;

      this.newCollection.fetch({
        // url: baseURL + 'offset=' + offset + '&limit=' + limit,
        success: function (data) {
          console.log(data);

          if (!data) {
            return console.log('There are no more data to be retrieved.');
          }

          var models = data.models,
              len = models.length,
              model,
              itemView,
              cachedDom = [];

          for (var  i = 0; i < len; i++) {
            model = models[i].parseDates();
            _this.collection.add(model);

            itemView = new _this.childView({model: model});
            cachedDom.push(itemView.el);
          }

          _this.$el.find('.table-data').append(cachedDom);

        },
        error: function (req, status, err) {
          console.log(err.message);
        }
      });

    }

  });


  return {
    'SortableCollection': SortableCollection,
    'SortableTableView':  SortableTableView
  };

});